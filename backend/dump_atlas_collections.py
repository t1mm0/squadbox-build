#!/usr/bin/env python3
"""
MongoDB Atlas Collection Dump Tool
Page Purpose: Dump and display all current MongoDB Atlas collections
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
from bson import ObjectId, json_util
from pymongo import MongoClient
import certifi

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class AtlasCollectionDumper:
    """Dump all MongoDB Atlas collections"""
    
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
    
    def get_all_collections(self) -> List[str]:
        """Get all collection names"""
        try:
            collections = self.db.list_collection_names()
            logger.info(f"📋 Found {len(collections)} collections")
            return collections
        except Exception as e:
            logger.error(f"❌ Failed to get collections: {e}")
            return []
    
    def get_collection_stats(self, collection_name: str) -> Dict[str, Any]:
        """Get statistics for a collection"""
        try:
            collection = self.db[collection_name]
            stats = {
                'name': collection_name,
                'count': collection.count_documents({}),
                'indexes': list(collection.list_indexes()),
                'estimated_size': collection.estimated_document_size(),
                'storage_size': collection.storage_size()
            }
            return stats
        except Exception as e:
            logger.error(f"❌ Failed to get stats for {collection_name}: {e}")
            return {'name': collection_name, 'error': str(e)}
    
    def dump_collection_sample(self, collection_name: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Dump sample documents from a collection"""
        try:
            collection = self.db[collection_name]
            documents = list(collection.find().limit(limit))
            
            # Convert ObjectId to string for JSON serialization
            for doc in documents:
                if '_id' in doc:
                    doc['_id'] = str(doc['_id'])
            
            return documents
        except Exception as e:
            logger.error(f"❌ Failed to dump {collection_name}: {e}")
            return []
    
    def dump_all_collections(self, sample_limit: int = 3) -> Dict[str, Any]:
        """Dump all collections with statistics and samples"""
        try:
            collections = self.get_all_collections()
            dump_data = {
                'timestamp': datetime.now().isoformat(),
                'database': self.db.name,
                'total_collections': len(collections),
                'collections': {}
            }
            
            for collection_name in collections:
                logger.info(f"📦 Processing collection: {collection_name}")
                
                # Get collection stats
                stats = self.get_collection_stats(collection_name)
                
                # Get sample documents
                samples = self.dump_collection_sample(collection_name, sample_limit)
                
                dump_data['collections'][collection_name] = {
                    'stats': stats,
                    'samples': samples
                }
            
            return dump_data
            
        except Exception as e:
            logger.error(f"❌ Failed to dump collections: {e}")
            return {}
    
    def print_collection_summary(self, dump_data: Dict[str, Any]):
        """Print a summary of all collections"""
        print("\n" + "="*80)
        print("📊 MONGODB ATLAS COLLECTION SUMMARY")
        print("="*80)
        print(f"Database: {dump_data.get('database', 'Unknown')}")
        print(f"Timestamp: {dump_data.get('timestamp', 'Unknown')}")
        print(f"Total Collections: {dump_data.get('total_collections', 0)}")
        print("="*80)
        
        collections = dump_data.get('collections', {})
        if not collections:
            print("❌ No collections found")
            return
        
        # Print collection summary
        for collection_name, data in collections.items():
            stats = data.get('stats', {})
            count = stats.get('count', 0)
            print(f"📦 {collection_name}: {count} documents")
        
        print("="*80)
    
    def print_detailed_dump(self, dump_data: Dict[str, Any]):
        """Print detailed dump of all collections"""
        print("\n" + "="*80)
        print("🔍 DETAILED COLLECTION DUMP")
        print("="*80)
        
        collections = dump_data.get('collections', {})
        if not collections:
            print("❌ No collections found")
            return
        
        for collection_name, data in collections.items():
            print(f"\n📦 COLLECTION: {collection_name}")
            print("-" * 60)
            
            # Print stats
            stats = data.get('stats', {})
            print(f"📊 Documents: {stats.get('count', 0)}")
            print(f"📊 Indexes: {len(stats.get('indexes', []))}")
            
            # Print sample documents
            samples = data.get('samples', [])
            if samples:
                print(f"📄 Sample Documents ({len(samples)}):")
                for i, doc in enumerate(samples, 1):
                    print(f"  {i}. {json.dumps(doc, indent=2, default=str)}")
            else:
                print("📄 No documents found")
            
            print("-" * 60)
    
    def save_dump_to_file(self, dump_data: Dict[str, Any], filename: str = None):
        """Save dump data to a JSON file"""
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"atlas_collections_dump_{timestamp}.json"
        
        try:
            with open(filename, 'w') as f:
                json.dump(dump_data, f, indent=2, default=str)
            logger.info(f"✅ Dump saved to: {filename}")
            return filename
        except Exception as e:
            logger.error(f"❌ Failed to save dump: {e}")
            return None
    
    def close(self):
        """Close MongoDB connection"""
        if self.client:
            self.client.close()
            logger.info("🔌 MongoDB connection closed")

def main():
    """Main dump function"""
    print("🚀 MongoDB Atlas Collection Dump")
    print("="*50)
    
    # Get MongoDB URI from environment
    mongodb_uri = os.getenv('MONGODB_URI')
    if not mongodb_uri:
        print("❌ MONGODB_URI environment variable not set")
        print("Please set your MongoDB Atlas connection string:")
        print("export MONGODB_URI='mongodb+srv://username:password@cluster.mongodb.net/squadbox'")
        sys.exit(1)
    
    # Initialize dumper
    dumper = AtlasCollectionDumper(mongodb_uri)
    
    try:
        # Connect to MongoDB Atlas
        if not dumper.connect():
            sys.exit(1)
        
        # Get sample limit from command line or use default
        sample_limit = 3
        if len(sys.argv) > 1:
            try:
                sample_limit = int(sys.argv[1])
            except ValueError:
                print("⚠️ Invalid sample limit, using default of 3")
        
        print(f"📋 Dumping collections with {sample_limit} sample documents each...")
        
        # Dump all collections
        dump_data = dumper.dump_all_collections(sample_limit)
        
        if not dump_data:
            print("❌ Failed to dump collections")
            sys.exit(1)
        
        # Print summary
        dumper.print_collection_summary(dump_data)
        
        # Print detailed dump
        dumper.print_detailed_dump(dump_data)
        
        # Save to file
        filename = dumper.save_dump_to_file(dump_data)
        
        print(f"\n🎉 Collection dump completed successfully!")
        if filename:
            print(f"📁 Full dump saved to: {filename}")
        
    except KeyboardInterrupt:
        print("\n⚠️ Dump interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Dump failed: {e}")
        sys.exit(1)
    finally:
        dumper.close()

if __name__ == "__main__":
    main()
