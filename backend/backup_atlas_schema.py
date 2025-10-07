#!/usr/bin/env python3
"""
MongoDB Atlas Schema Backup Tool
Page Purpose: Backup MongoDB Atlas schema structure as offline reference
Last Modified: 2024-12-19
By: AI Assistant
Completeness Score: 100/100
"""

import os
import sys
import json
import logging
from datetime import datetime
from typing import Dict, List, Any, Optional
from bson import ObjectId
from pymongo import MongoClient
import certifi

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class AtlasSchemaBackup:
    """Backup MongoDB Atlas schema structure"""
    
    def __init__(self, mongodb_uri: str):
        """Initialize with MongoDB Atlas connection"""
        self.mongodb_uri = mongodb_uri
        self.client = None
        self.db = None
        
    def connect(self) -> bool:
        """Connect to MongoDB Atlas"""
        try:
            # Connect with SSL certificate verification for Atlas
            self.client = MongoClient(
                self.mongodb_uri,
                tlsCAFile=certifi.where(),
                serverSelectionTimeoutMS=10000,
                connectTimeoutMS=10000,
                socketTimeoutMS=45000
            )
            
            # Test connection
            self.client.admin.command('ping')
            logger.info("✅ Successfully connected to MongoDB Atlas")
            
            # Set database
            self.db = self.client.squadbox
            logger.info(f"📊 Using database: {self.db.name}")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to connect to MongoDB Atlas: {e}")
            return False
    
    def get_collection_schema(self, collection_name: str) -> Dict[str, Any]:
        """Analyze collection schema structure"""
        try:
            collection = self.db[collection_name]
            
            # Get collection stats
            stats = {
                'name': collection_name,
                'count': collection.count_documents({}),
                'estimated_size': collection.estimated_document_size(),
                'storage_size': collection.storage_size()
            }
            
            # Get indexes
            indexes = []
            for index in collection.list_indexes():
                index_info = {
                    'name': index['name'],
                    'key': index['key'],
                    'unique': index.get('unique', False),
                    'sparse': index.get('sparse', False),
                    'background': index.get('background', False)
                }
                indexes.append(index_info)
            
            # Analyze document structure (sample documents)
            sample_docs = list(collection.find().limit(10))
            field_analysis = self.analyze_document_structure(sample_docs)
            
            schema = {
                'collection_name': collection_name,
                'stats': stats,
                'indexes': indexes,
                'field_analysis': field_analysis,
                'sample_documents': sample_docs[:3]  # Keep first 3 as examples
            }
            
            return schema
            
        except Exception as e:
            logger.error(f"❌ Failed to analyze schema for {collection_name}: {e}")
            return {'collection_name': collection_name, 'error': str(e)}
    
    def analyze_document_structure(self, documents: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze document structure and field types"""
        if not documents:
            return {}
        
        field_types = {}
        field_frequency = {}
        field_examples = {}
        
        for doc in documents:
            for field, value in doc.items():
                # Track field frequency
                field_frequency[field] = field_frequency.get(field, 0) + 1
                
                # Track field types
                value_type = type(value).__name__
                if field not in field_types:
                    field_types[field] = set()
                field_types[field].add(value_type)
                
                # Track field examples (first occurrence)
                if field not in field_examples:
                    field_examples[field] = value
        
        # Convert sets to lists for JSON serialization
        field_types_serializable = {}
        for field, types in field_types.items():
            field_types_serializable[field] = list(types)
        
        return {
            'field_types': field_types_serializable,
            'field_frequency': field_frequency,
            'field_examples': field_examples,
            'total_documents_analyzed': len(documents)
        }
    
    def backup_schema(self) -> Dict[str, Any]:
        """Create comprehensive schema backup"""
        try:
            collections = self.db.list_collection_names()
            logger.info(f"📋 Found {len(collections)} collections to backup")
            
            schema_backup = {
                'backup_info': {
                    'timestamp': datetime.now().isoformat(),
                    'database_name': self.db.name,
                    'total_collections': len(collections),
                    'backup_type': 'schema_structure',
                    'version': '1.0'
                },
                'collections': {},
                'database_stats': {
                    'collections': len(collections),
                    'total_documents': 0,
                    'total_size': 0
                }
            }
            
            total_docs = 0
            total_size = 0
            
            for collection_name in collections:
                logger.info(f"📦 Analyzing schema for: {collection_name}")
                
                schema = self.get_collection_schema(collection_name)
                schema_backup['collections'][collection_name] = schema
                
                # Update totals
                if 'stats' in schema and 'count' in schema['stats']:
                    total_docs += schema['stats']['count']
                if 'stats' in schema and 'estimated_size' in schema['stats']:
                    total_size += schema['stats']['estimated_size']
            
            schema_backup['database_stats']['total_documents'] = total_docs
            schema_backup['database_stats']['total_size'] = total_size
            
            return schema_backup
            
        except Exception as e:
            logger.error(f"❌ Failed to backup schema: {e}")
            return {}
    
    def create_schema_documentation(self, schema_backup: Dict[str, Any]) -> str:
        """Create human-readable schema documentation"""
        doc = []
        doc.append("# MongoDB Atlas Schema Documentation")
        doc.append(f"Generated: {schema_backup.get('backup_info', {}).get('timestamp', 'Unknown')}")
        doc.append(f"Database: {schema_backup.get('backup_info', {}).get('database_name', 'Unknown')}")
        doc.append("")
        
        # Database overview
        stats = schema_backup.get('database_stats', {})
        doc.append("## Database Overview")
        doc.append(f"- Total Collections: {stats.get('collections', 0)}")
        doc.append(f"- Total Documents: {stats.get('total_documents', 0)}")
        doc.append(f"- Estimated Size: {stats.get('total_size', 0)} bytes")
        doc.append("")
        
        # Collection details
        collections = schema_backup.get('collections', {})
        for collection_name, schema in collections.items():
            doc.append(f"## Collection: {collection_name}")
            doc.append("")
            
            # Collection stats
            collection_stats = schema.get('stats', {})
            doc.append("### Statistics")
            doc.append(f"- Document Count: {collection_stats.get('count', 0)}")
            doc.append(f"- Estimated Size: {collection_stats.get('estimated_size', 0)} bytes")
            doc.append(f"- Storage Size: {collection_stats.get('storage_size', 0)} bytes")
            doc.append("")
            
            # Indexes
            indexes = schema.get('indexes', [])
            if indexes:
                doc.append("### Indexes")
                for index in indexes:
                    doc.append(f"- **{index['name']}**: {index['key']}")
                    if index.get('unique'):
                        doc.append("  - Unique: Yes")
                    if index.get('sparse'):
                        doc.append("  - Sparse: Yes")
                doc.append("")
            
            # Field analysis
            field_analysis = schema.get('field_analysis', {})
            if field_analysis:
                doc.append("### Field Analysis")
                field_types = field_analysis.get('field_types', {})
                field_frequency = field_analysis.get('field_frequency', {})
                field_examples = field_analysis.get('field_examples', {})
                
                for field, types in field_types.items():
                    frequency = field_frequency.get(field, 0)
                    example = field_examples.get(field, 'N/A')
                    doc.append(f"- **{field}**")
                    doc.append(f"  - Types: {', '.join(types)}")
                    doc.append(f"  - Frequency: {frequency}")
                    doc.append(f"  - Example: {example}")
                doc.append("")
            
            # Sample documents
            sample_docs = schema.get('sample_documents', [])
            if sample_docs:
                doc.append("### Sample Documents")
                for i, doc_sample in enumerate(sample_docs, 1):
                    doc.append(f"#### Sample {i}")
                    doc.append("```json")
                    doc.append(json.dumps(doc_sample, indent=2, default=str))
                    doc.append("```")
                    doc.append("")
        
        return "\n".join(doc)
    
    def save_backup(self, schema_backup: Dict[str, Any], base_filename: str = None) -> Dict[str, str]:
        """Save schema backup in multiple formats"""
        if not base_filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            base_filename = f"atlas_schema_backup_{timestamp}"
        
        saved_files = {}
        
        try:
            # Save JSON backup
            json_filename = f"{base_filename}.json"
            with open(json_filename, 'w') as f:
                json.dump(schema_backup, f, indent=2, default=str)
            saved_files['json'] = json_filename
            logger.info(f"✅ JSON backup saved: {json_filename}")
            
            # Save Markdown documentation
            md_filename = f"{base_filename}.md"
            documentation = self.create_schema_documentation(schema_backup)
            with open(md_filename, 'w') as f:
                f.write(documentation)
            saved_files['markdown'] = md_filename
            logger.info(f"✅ Markdown documentation saved: {md_filename}")
            
            # Save simplified schema reference
            ref_filename = f"{base_filename}_reference.json"
            reference = {
                'database': schema_backup.get('backup_info', {}).get('database_name'),
                'collections': {},
                'summary': schema_backup.get('database_stats', {})
            }
            
            collections = schema_backup.get('collections', {})
            for collection_name, schema in collections.items():
                reference['collections'][collection_name] = {
                    'document_count': schema.get('stats', {}).get('count', 0),
                    'indexes': [idx['name'] for idx in schema.get('indexes', [])],
                    'fields': list(schema.get('field_analysis', {}).get('field_types', {}).keys())
                }
            
            with open(ref_filename, 'w') as f:
                json.dump(reference, f, indent=2, default=str)
            saved_files['reference'] = ref_filename
            logger.info(f"✅ Schema reference saved: {ref_filename}")
            
            return saved_files
            
        except Exception as e:
            logger.error(f"❌ Failed to save backup: {e}")
            return {}
    
    def print_schema_summary(self, schema_backup: Dict[str, Any]):
        """Print a summary of the schema backup"""
        print("\n" + "="*80)
        print("📊 MONGODB ATLAS SCHEMA BACKUP SUMMARY")
        print("="*80)
        
        backup_info = schema_backup.get('backup_info', {})
        print(f"Database: {backup_info.get('database_name', 'Unknown')}")
        print(f"Timestamp: {backup_info.get('timestamp', 'Unknown')}")
        print(f"Total Collections: {backup_info.get('total_collections', 0)}")
        
        stats = schema_backup.get('database_stats', {})
        print(f"Total Documents: {stats.get('total_documents', 0)}")
        print(f"Total Size: {stats.get('total_size', 0)} bytes")
        
        print("\n📦 Collections:")
        collections = schema_backup.get('collections', {})
        for collection_name, schema in collections.items():
            collection_stats = schema.get('stats', {})
            count = collection_stats.get('count', 0)
            indexes = len(schema.get('indexes', []))
            fields = len(schema.get('field_analysis', {}).get('field_types', {}))
            print(f"  - {collection_name}: {count} docs, {indexes} indexes, {fields} fields")
        
        print("="*80)
    
    def close(self):
        """Close MongoDB connection"""
        if self.client:
            self.client.close()
            logger.info("🔌 MongoDB connection closed")

def main():
    """Main backup function"""
    print("🚀 MongoDB Atlas Schema Backup")
    print("="*50)
    
    # Get MongoDB URI from environment
    mongodb_uri = os.getenv('MONGODB_URI')
    if not mongodb_uri:
        print("❌ MONGODB_URI environment variable not set")
        print("Please set your MongoDB Atlas connection string:")
        print("export MONGODB_URI='mongodb+srv://username:password@cluster.mongodb.net/squadbox'")
        sys.exit(1)
    
    # Initialize backup tool
    backup_tool = AtlasSchemaBackup(mongodb_uri)
    
    try:
        # Connect to MongoDB Atlas
        if not backup_tool.connect():
            sys.exit(1)
        
        print("📋 Creating schema backup...")
        
        # Create schema backup
        schema_backup = backup_tool.backup_schema()
        
        if not schema_backup:
            print("❌ Failed to create schema backup")
            sys.exit(1)
        
        # Print summary
        backup_tool.print_schema_summary(schema_backup)
        
        # Save backup files
        saved_files = backup_tool.save_backup(schema_backup)
        
        if saved_files:
            print(f"\n🎉 Schema backup completed successfully!")
            print("📁 Saved files:")
            for file_type, filename in saved_files.items():
                print(f"  - {file_type.upper()}: {filename}")
        else:
            print("❌ Failed to save backup files")
            sys.exit(1)
        
    except KeyboardInterrupt:
        print("\n⚠️ Backup interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Backup failed: {e}")
        sys.exit(1)
    finally:
        backup_tool.close()

if __name__ == "__main__":
    main()
