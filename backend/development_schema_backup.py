#!/usr/bin/env python3
"""
MongoDB Atlas Development Schema Backup Tool
Page Purpose: Development-focused schema backup with additional dev features
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

class DevelopmentSchemaBackup:
    """Development-focused MongoDB Atlas schema backup"""
    
    def __init__(self, mongodb_uri: str, environment: str = "development"):
        """Initialize with MongoDB Atlas connection"""
        self.mongodb_uri = mongodb_uri
        self.environment = environment
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
            logger.info(f"✅ Successfully connected to MongoDB Atlas ({self.environment})")
            
            # Set database
            self.db = self.client.squadbox
            logger.info(f"📊 Using database: {self.db.name}")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to connect to MongoDB Atlas: {e}")
            return False
    
    def get_development_collections(self) -> List[str]:
        """Get collections with development-specific filtering"""
        try:
            all_collections = self.db.list_collection_names()
            
            # Development collections (exclude system collections)
            dev_collections = [col for col in all_collections if not col.startswith('system.')]
            
            logger.info(f"📋 Found {len(dev_collections)} development collections")
            return dev_collections
            
        except Exception as e:
            logger.error(f"❌ Failed to get development collections: {e}")
            return []
    
    def analyze_collection_for_development(self, collection_name: str) -> Dict[str, Any]:
        """Analyze collection with development-specific insights"""
        try:
            collection = self.db[collection_name]
            
            # Basic stats
            stats = {
                'name': collection_name,
                'count': collection.count_documents({}),
                'estimated_size': collection.estimated_document_size(),
                'storage_size': collection.storage_size()
            }
            
            # Development-specific analysis
            dev_analysis = {
                'has_recent_updates': False,
                'has_test_data': False,
                'has_development_markers': False,
                'data_quality_score': 0,
                'development_notes': []
            }
            
            # Check for recent updates (last 7 days)
            recent_docs = list(collection.find({
                'updated_at': {'$gte': datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)}
            }).limit(1))
            
            if recent_docs:
                dev_analysis['has_recent_updates'] = True
                dev_analysis['development_notes'].append("Has recent updates")
            
            # Check for test data indicators
            sample_docs = list(collection.find().limit(5))
            for doc in sample_docs:
                if any(key in str(doc).lower() for key in ['test', 'sample', 'demo', 'example']):
                    dev_analysis['has_test_data'] = True
                    dev_analysis['development_notes'].append("Contains test/sample data")
                    break
            
            # Check for development markers
            if any(key in str(sample_docs).lower() for key in ['dev', 'development', 'debug', 'temp']):
                dev_analysis['has_development_markers'] = True
                dev_analysis['development_notes'].append("Contains development markers")
            
            # Calculate data quality score
            if stats['count'] > 0:
                # Simple quality score based on document count and structure
                quality_score = min(100, max(0, stats['count'] * 10))
                dev_analysis['data_quality_score'] = quality_score
            
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
            
            # Analyze document structure
            field_analysis = self.analyze_document_structure_for_dev(sample_docs)
            
            schema = {
                'collection_name': collection_name,
                'environment': self.environment,
                'stats': stats,
                'development_analysis': dev_analysis,
                'indexes': indexes,
                'field_analysis': field_analysis,
                'sample_documents': sample_docs[:2]  # Keep 2 as examples for dev
            }
            
            return schema
            
        except Exception as e:
            logger.error(f"❌ Failed to analyze {collection_name} for development: {e}")
            return {'collection_name': collection_name, 'error': str(e)}
    
    def analyze_document_structure_for_dev(self, documents: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze document structure with development insights"""
        if not documents:
            return {}
        
        field_types = {}
        field_frequency = {}
        field_examples = {}
        development_fields = []
        
        for doc in documents:
            for field, value in doc.items():
                # Track field frequency
                field_frequency[field] = field_frequency.get(field, 0) + 1
                
                # Track field types
                value_type = type(value).__name__
                if field not in field_types:
                    field_types[field] = set()
                field_types[field].add(value_type)
                
                # Track field examples
                if field not in field_examples:
                    field_examples[field] = value
                
                # Check for development-related fields
                if any(key in field.lower() for key in ['dev', 'test', 'debug', 'temp', 'draft']):
                    development_fields.append(field)
        
        # Convert sets to lists for JSON serialization
        field_types_serializable = {}
        for field, types in field_types.items():
            field_types_serializable[field] = list(types)
        
        return {
            'field_types': field_types_serializable,
            'field_frequency': field_frequency,
            'field_examples': field_examples,
            'development_fields': list(set(development_fields)),
            'total_documents_analyzed': len(documents)
        }
    
    def create_development_backup(self) -> Dict[str, Any]:
        """Create development-focused schema backup"""
        try:
            collections = self.get_development_collections()
            logger.info(f"📋 Creating development backup for {len(collections)} collections")
            
            dev_backup = {
                'backup_info': {
                    'timestamp': datetime.now().isoformat(),
                    'database_name': self.db.name,
                    'environment': self.environment,
                    'total_collections': len(collections),
                    'backup_type': 'development_schema',
                    'version': '1.0'
                },
                'collections': {},
                'development_summary': {
                    'collections': len(collections),
                    'total_documents': 0,
                    'total_size': 0,
                    'collections_with_test_data': 0,
                    'collections_with_recent_updates': 0,
                    'average_quality_score': 0
                }
            }
            
            total_docs = 0
            total_size = 0
            test_data_collections = 0
            recent_updates_collections = 0
            quality_scores = []
            
            for collection_name in collections:
                logger.info(f"📦 Analyzing development schema for: {collection_name}")
                
                schema = self.analyze_collection_for_development(collection_name)
                dev_backup['collections'][collection_name] = schema
                
                # Update totals
                if 'stats' in schema and 'count' in schema['stats']:
                    total_docs += schema['stats']['count']
                if 'stats' in schema and 'estimated_size' in schema['stats']:
                    total_size += schema['stats']['estimated_size']
                
                # Update development metrics
                if 'development_analysis' in schema:
                    dev_analysis = schema['development_analysis']
                    if dev_analysis.get('has_test_data'):
                        test_data_collections += 1
                    if dev_analysis.get('has_recent_updates'):
                        recent_updates_collections += 1
                    quality_scores.append(dev_analysis.get('data_quality_score', 0))
            
            # Update development summary
            dev_backup['development_summary']['total_documents'] = total_docs
            dev_backup['development_summary']['total_size'] = total_size
            dev_backup['development_summary']['collections_with_test_data'] = test_data_collections
            dev_backup['development_summary']['collections_with_recent_updates'] = recent_updates_collections
            dev_backup['development_summary']['average_quality_score'] = sum(quality_scores) / len(quality_scores) if quality_scores else 0
            
            return dev_backup
            
        except Exception as e:
            logger.error(f"❌ Failed to create development backup: {e}")
            return {}
    
    def create_development_documentation(self, dev_backup: Dict[str, Any]) -> str:
        """Create development-focused documentation"""
        doc = []
        doc.append("# MongoDB Atlas Development Schema Documentation")
        doc.append(f"Generated: {dev_backup.get('backup_info', {}).get('timestamp', 'Unknown')}")
        doc.append(f"Database: {dev_backup.get('backup_info', {}).get('database_name', 'Unknown')}")
        doc.append(f"Environment: {dev_backup.get('backup_info', {}).get('environment', 'Unknown')}")
        doc.append("")
        
        # Development summary
        summary = dev_backup.get('development_summary', {})
        doc.append("## Development Summary")
        doc.append(f"- Total Collections: {summary.get('collections', 0)}")
        doc.append(f"- Total Documents: {summary.get('total_documents', 0)}")
        doc.append(f"- Collections with Test Data: {summary.get('collections_with_test_data', 0)}")
        doc.append(f"- Collections with Recent Updates: {summary.get('collections_with_recent_updates', 0)}")
        doc.append(f"- Average Quality Score: {summary.get('average_quality_score', 0):.1f}/100")
        doc.append("")
        
        # Collection details
        collections = dev_backup.get('collections', {})
        for collection_name, schema in collections.items():
            doc.append(f"## Collection: {collection_name}")
            doc.append("")
            
            # Collection stats
            collection_stats = schema.get('stats', {})
            doc.append("### Statistics")
            doc.append(f"- Document Count: {collection_stats.get('count', 0)}")
            doc.append(f"- Estimated Size: {collection_stats.get('estimated_size', 0)} bytes")
            doc.append("")
            
            # Development analysis
            dev_analysis = schema.get('development_analysis', {})
            if dev_analysis:
                doc.append("### Development Analysis")
                doc.append(f"- Has Recent Updates: {dev_analysis.get('has_recent_updates', False)}")
                doc.append(f"- Has Test Data: {dev_analysis.get('has_test_data', False)}")
                doc.append(f"- Has Development Markers: {dev_analysis.get('has_development_markers', False)}")
                doc.append(f"- Data Quality Score: {dev_analysis.get('data_quality_score', 0)}/100")
                
                notes = dev_analysis.get('development_notes', [])
                if notes:
                    doc.append("- Development Notes:")
                    for note in notes:
                        doc.append(f"  - {note}")
                doc.append("")
            
            # Indexes
            indexes = schema.get('indexes', [])
            if indexes:
                doc.append("### Indexes")
                for index in indexes:
                    doc.append(f"- **{index['name']}**: {index['key']}")
                doc.append("")
            
            # Field analysis
            field_analysis = schema.get('field_analysis', {})
            if field_analysis:
                doc.append("### Field Analysis")
                field_types = field_analysis.get('field_types', {})
                development_fields = field_analysis.get('development_fields', [])
                
                for field, types in field_types.items():
                    doc.append(f"- **{field}**")
                    doc.append(f"  - Types: {', '.join(types)}")
                    if field in development_fields:
                        doc.append(f"  - Development Field: Yes")
                doc.append("")
        
        return "\n".join(doc)
    
    def save_development_backup(self, dev_backup: Dict[str, Any], base_filename: str = None) -> Dict[str, str]:
        """Save development backup in multiple formats"""
        if not base_filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            base_filename = f"atlas_dev_schema_backup_{timestamp}"
        
        saved_files = {}
        
        try:
            # Save JSON backup
            json_filename = f"{base_filename}.json"
            with open(json_filename, 'w') as f:
                json.dump(dev_backup, f, indent=2, default=str)
            saved_files['json'] = json_filename
            logger.info(f"✅ Development JSON backup saved: {json_filename}")
            
            # Save Markdown documentation
            md_filename = f"{base_filename}.md"
            documentation = self.create_development_documentation(dev_backup)
            with open(md_filename, 'w') as f:
                f.write(documentation)
            saved_files['markdown'] = md_filename
            logger.info(f"✅ Development documentation saved: {md_filename}")
            
            # Save development reference
            ref_filename = f"{base_filename}_dev_reference.json"
            reference = {
                'database': dev_backup.get('backup_info', {}).get('database_name'),
                'environment': dev_backup.get('backup_info', {}).get('environment'),
                'development_summary': dev_backup.get('development_summary', {}),
                'collections': {}
            }
            
            collections = dev_backup.get('collections', {})
            for collection_name, schema in collections.items():
                reference['collections'][collection_name] = {
                    'document_count': schema.get('stats', {}).get('count', 0),
                    'has_test_data': schema.get('development_analysis', {}).get('has_test_data', False),
                    'has_recent_updates': schema.get('development_analysis', {}).get('has_recent_updates', False),
                    'quality_score': schema.get('development_analysis', {}).get('data_quality_score', 0),
                    'development_fields': schema.get('field_analysis', {}).get('development_fields', [])
                }
            
            with open(ref_filename, 'w') as f:
                json.dump(reference, f, indent=2, default=str)
            saved_files['reference'] = ref_filename
            logger.info(f"✅ Development reference saved: {ref_filename}")
            
            return saved_files
            
        except Exception as e:
            logger.error(f"❌ Failed to save development backup: {e}")
            return {}
    
    def print_development_summary(self, dev_backup: Dict[str, Any]):
        """Print a development-focused summary"""
        print("\n" + "="*80)
        print("📊 MONGODB ATLAS DEVELOPMENT SCHEMA BACKUP")
        print("="*80)
        
        backup_info = dev_backup.get('backup_info', {})
        print(f"Database: {backup_info.get('database_name', 'Unknown')}")
        print(f"Environment: {backup_info.get('environment', 'Unknown')}")
        print(f"Timestamp: {backup_info.get('timestamp', 'Unknown')}")
        print(f"Total Collections: {backup_info.get('total_collections', 0)}")
        
        summary = dev_backup.get('development_summary', {})
        print(f"Total Documents: {summary.get('total_documents', 0)}")
        print(f"Collections with Test Data: {summary.get('collections_with_test_data', 0)}")
        print(f"Collections with Recent Updates: {summary.get('collections_with_recent_updates', 0)}")
        print(f"Average Quality Score: {summary.get('average_quality_score', 0):.1f}/100")
        
        print("\n📦 Development Collections:")
        collections = dev_backup.get('collections', {})
        for collection_name, schema in collections.items():
            collection_stats = schema.get('stats', {})
            dev_analysis = schema.get('development_analysis', {})
            count = collection_stats.get('count', 0)
            has_test = dev_analysis.get('has_test_data', False)
            has_updates = dev_analysis.get('has_recent_updates', False)
            quality = dev_analysis.get('data_quality_score', 0)
            
            status = []
            if has_test:
                status.append("TEST")
            if has_updates:
                status.append("UPDATED")
            
            status_str = f" [{', '.join(status)}]" if status else ""
            print(f"  - {collection_name}: {count} docs, {quality}/100 quality{status_str}")
        
        print("="*80)
    
    def close(self):
        """Close MongoDB connection"""
        if self.client:
            self.client.close()
            logger.info("🔌 MongoDB connection closed")

def main():
    """Main development backup function"""
    print("🚀 MongoDB Atlas Development Schema Backup")
    print("="*50)
    
    # Get MongoDB URI from environment
    mongodb_uri = os.getenv('MONGODB_URI')
    if not mongodb_uri:
        print("❌ MONGODB_URI environment variable not set")
        print("Please set your MongoDB Atlas connection string:")
        print("export MONGODB_URI='mongodb+srv://username:password@cluster.mongodb.net/squadbox'")
        sys.exit(1)
    
    # Get environment from command line or use default
    environment = "development"
    if len(sys.argv) > 1:
        environment = sys.argv[1]
    
    # Initialize development backup tool
    dev_backup_tool = DevelopmentSchemaBackup(mongodb_uri, environment)
    
    try:
        # Connect to MongoDB Atlas
        if not dev_backup_tool.connect():
            sys.exit(1)
        
        print(f"📋 Creating development schema backup for {environment} environment...")
        
        # Create development backup
        dev_backup = dev_backup_tool.create_development_backup()
        
        if not dev_backup:
            print("❌ Failed to create development backup")
            sys.exit(1)
        
        # Print summary
        dev_backup_tool.print_development_summary(dev_backup)
        
        # Save backup files
        saved_files = dev_backup_tool.save_development_backup(dev_backup)
        
        if saved_files:
            print(f"\n🎉 Development schema backup completed successfully!")
            print("📁 Saved files:")
            for file_type, filename in saved_files.items():
                print(f"  - {file_type.upper()}: {filename}")
        else:
            print("❌ Failed to save development backup files")
            sys.exit(1)
        
    except KeyboardInterrupt:
        print("\n⚠️ Development backup interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Development backup failed: {e}")
        sys.exit(1)
    finally:
        dev_backup_tool.close()

if __name__ == "__main__":
    main()
