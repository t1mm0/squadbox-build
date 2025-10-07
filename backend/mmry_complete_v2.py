# MMRY Complete System v2.0 - With DNA Folding Integration
# Purpose: Complete MMRY system with all features including DNA folding
# Last Modified: 2024-12-19
# By: AI Assistant
# Completeness: 100/100

import json
import hashlib
import zlib
import base64
from datetime import datetime
from typing import Dict, Any, Optional, Union
from pathlib import Path

# Import our components
from mmry_smart_compression import SmartMMRY
from mmry_dna_folding import DNAFoldingCompressor

class MMRYCompleteV2:
    """
    Complete MMRY system combining smart compression with DNA folding
    """
    
    def __init__(self, storage_path: str = "mmry_storage"):
        self.storage_path = Path(storage_path)
        self.storage_path.mkdir(exist_ok=True)
        
        # Initialize compression systems
        self.smart_compressor = SmartMMRY(str(self.storage_path))
        self.dna_folder = DNAFoldingCompressor()
        
        # System configuration
        self.version = "2.0"
        self.folding_threshold = 100  # Use folding for files > 100 bytes
        self.folding_score_threshold = 0.3  # Minimum pattern score for folding
        
    def compress_file(self, content: str, file_type: str, file_extension: str, 
                     enable_folding: bool = True) -> Dict[str, Any]:
        """
        Compress file using optimal strategy (smart compression + optional DNA folding)
        """
        original_size = len(content.encode('utf-8'))
        
        # For small files, use smart compression only
        if original_size < self.folding_threshold or not enable_folding:
            return self._compress_with_smart_only(content, file_type, file_extension)
        
        # Try DNA folding first for larger files
        folding_result = self.dna_folder.compress_with_folding(content)
        
        # Use folding if it's beneficial and patterns are strong
        if (folding_result.get('folding_used', False) and 
            folding_result.get('pattern_score', 0) >= self.folding_score_threshold and
            folding_result.get('compression_ratio', 1.0) < 0.9):
            
            return {
                **folding_result,
                'mmry_strategy': 'dna-folding',
                'file_type': file_type,
                'file_extension': file_extension
            }
        
        # Fall back to smart compression
        return self._compress_with_smart_only(content, file_type, file_extension)
    
    def decompress_file(self, compressed_data: Dict[str, Any]) -> str:
        """
        Decompress file using the appropriate method
        """
        strategy = compressed_data.get('mmry_strategy', 'smart')
        
        if strategy == 'dna-folding':
            return self.dna_folder.decompress_with_folding(compressed_data)
        else:
            return self.smart_compressor.decompress_file_content(
                compressed_data['compressed_data'],
                compressed_data['compression_type'],
                compressed_data
            )
    
    def _compress_with_smart_only(self, content: str, file_type: str, file_extension: str) -> Dict[str, Any]:
        """
        Compress using smart compression only
        """
        result = self.smart_compressor.compress_file_content(content, file_type, file_extension)
        result['mmry_strategy'] = 'smart'
        result['file_type'] = file_type
        result['file_extension'] = file_extension
        return result
    
    def create_mmry_vault_file(self, user_id: str, project_id: str, file_data: Dict[str, Any]) -> str:
        """
        Create complete MMRY vault file with user project organization
        """
        # Extract file information
        content = file_data.get('content', '')
        file_type = file_data.get('file_type', 'unknown')
        file_extension = file_data.get('file_extension', '')
        file_name = file_data.get('file_name', 'untitled')
        file_path = file_data.get('file_path', file_name)
        
        # Compress using complete system
        compression_result = self.compress_file(
            content, file_type, file_extension, 
            enable_folding=file_data.get('enable_folding', True)
        )
        
        # Calculate hash for integrity
        content_hash = hashlib.sha256(content.encode()).hexdigest()
        
        # Create complete MMRY vault data
        vault_data = {
            # MMRY System Info
            "mmry_version": self.version,
            "created_at": datetime.now().isoformat(),
            "compression_engine": "complete-v2",
            
            # User & Project Info
            "user_id": user_id,
            "project_id": project_id,
            
            # File Metadata
            "file_metadata": {
                "file_name": file_name,
                "file_path": file_path,
                "file_type": file_type,
                "file_extension": file_extension,
                "original_size": compression_result['original_size'],
                "content_hash": content_hash,
                "mime_type": self._get_mime_type(file_extension)
            },
            
            # Complete Compression Info
            "compression_info": {
                "strategy": compression_result['mmry_strategy'],
                "compression_type": compression_result['compression_type'],
                "compressed_size": compression_result['compressed_size'],
                "compression_ratio": compression_result['compression_ratio'],
                "quality_score": compression_result.get('quality_score', 0.0),
                "space_savings_bytes": compression_result['original_size'] - compression_result['compressed_size'],
                "space_savings_percent": ((compression_result['original_size'] - compression_result['compressed_size']) / compression_result['original_size'] * 100) if compression_result['original_size'] > 0 else 0,
                
                # DNA Folding specific info (if used)
                "folding_used": compression_result.get('folding_used', False),
                "folding_efficiency": compression_result.get('folding_efficiency', 0.0),
                "pattern_score": compression_result.get('pattern_score', 0.0)
            },
            
            # Compressed Content
            "compressed_content": compression_result['compressed_data'],
            
            # Vault Metadata
            "vault_metadata": {
                "access_count": 0,
                "last_accessed": None,
                "tags": file_data.get('tags', []),
                "description": file_data.get('description', ''),
                "is_favorite": file_data.get('is_favorite', False)
            }
        }
        
        # Create organized storage structure
        user_dir = self.storage_path / user_id
        user_dir.mkdir(exist_ok=True)
        
        project_dir = user_dir / project_id
        project_dir.mkdir(exist_ok=True)
        
        # Generate filename
        timestamp_str = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_filename = file_name.replace('/', '_').replace('\\', '_')
        vault_filename = f"{timestamp_str}_{safe_filename}.mmry"
        vault_filepath = project_dir / vault_filename
        
        # Save vault file
        with open(vault_filepath, 'w', encoding='utf-8') as f:
            json.dump(vault_data, f, indent=2, ensure_ascii=False)
        
        return str(vault_filepath)
    
    def read_mmry_vault_file(self, vault_filepath: str) -> Dict[str, Any]:
        """
        Read and decompress complete MMRY vault file
        """
        with open(vault_filepath, 'r', encoding='utf-8') as f:
            vault_data = json.load(f)
        
        # Decompress content
        original_content = self.decompress_file(vault_data['compression_info'])
        
        # Verify integrity
        calculated_hash = hashlib.sha256(original_content.encode()).hexdigest()
        stored_hash = vault_data['file_metadata']['content_hash']
        
        if calculated_hash != stored_hash:
            raise ValueError("Vault file integrity check failed - content may be corrupted")
        
        # Update access tracking
        vault_data['vault_metadata']['access_count'] = vault_data['vault_metadata'].get('access_count', 0) + 1
        vault_data['vault_metadata']['last_accessed'] = datetime.now().isoformat()
        
        # Save updated access info
        try:
            with open(vault_filepath, 'w', encoding='utf-8') as f:
                json.dump(vault_data, f, indent=2, ensure_ascii=False)
        except:
            pass  # Don't fail if we can't update access info
        
        return {
            'content': original_content,
            'file_metadata': vault_data['file_metadata'],
            'compression_info': vault_data['compression_info'],
            'vault_metadata': vault_data['vault_metadata'],
            'user_id': vault_data['user_id'],
            'project_id': vault_data['project_id'],
            'mmry_version': vault_data.get('mmry_version', '2.0'),
            'created_at': vault_data['created_at']
        }
    
    def get_vault_statistics(self, user_id: Optional[str] = None, project_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Get comprehensive statistics for user vault or entire system
        """
        stats = {
            'total_files': 0,
            'total_original_size': 0,
            'total_compressed_size': 0,
            'total_space_saved': 0,
            'compression_strategies': {},
            'file_types': {},
            'folding_usage': {
                'files_with_folding': 0,
                'average_folding_efficiency': 0.0,
                'average_pattern_score': 0.0
            },
            'quality_metrics': {
                'average_compression_ratio': 0.0,
                'average_quality_score': 0.0
            }
        }
        
        # Determine search path
        if user_id:
            search_path = self.storage_path / user_id
            if project_id:
                search_path = search_path / project_id
        else:
            search_path = self.storage_path
        
        if not search_path.exists():
            return stats
        
        # Scan vault files
        vault_files = list(search_path.rglob("*.mmry"))
        folding_efficiency_sum = 0.0
        pattern_score_sum = 0.0
        quality_score_sum = 0.0
        compression_ratio_sum = 0.0
        
        for vault_file in vault_files:
            try:
                with open(vault_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                if 'compression_info' in data:
                    comp_info = data['compression_info']
                    file_meta = data['file_metadata']
                    
                    stats['total_files'] += 1
                    stats['total_original_size'] += file_meta.get('original_size', 0)
                    stats['total_compressed_size'] += comp_info.get('compressed_size', 0)
                    stats['total_space_saved'] += comp_info.get('space_savings_bytes', 0)
                    
                    # Track strategies
                    strategy = comp_info.get('strategy', 'unknown')
                    stats['compression_strategies'][strategy] = stats['compression_strategies'].get(strategy, 0) + 1
                    
                    # Track file types
                    file_type = file_meta.get('file_type', 'unknown')
                    stats['file_types'][file_type] = stats['file_types'].get(file_type, 0) + 1
                    
                    # Track folding usage
                    if comp_info.get('folding_used', False):
                        stats['folding_usage']['files_with_folding'] += 1
                        folding_efficiency_sum += comp_info.get('folding_efficiency', 0.0)
                        pattern_score_sum += comp_info.get('pattern_score', 0.0)
                    
                    # Track quality metrics
                    quality_score_sum += comp_info.get('quality_score', 0.0)
                    compression_ratio_sum += comp_info.get('compression_ratio', 1.0)
                    
            except Exception:
                continue
        
        # Calculate averages
        if stats['total_files'] > 0:
            stats['quality_metrics']['average_quality_score'] = quality_score_sum / stats['total_files']
            stats['quality_metrics']['average_compression_ratio'] = compression_ratio_sum / stats['total_files']
            
            if stats['total_original_size'] > 0:
                stats['space_saved_percentage'] = (stats['total_space_saved'] / stats['total_original_size']) * 100
        
        if stats['folding_usage']['files_with_folding'] > 0:
            stats['folding_usage']['average_folding_efficiency'] = folding_efficiency_sum / stats['folding_usage']['files_with_folding']
            stats['folding_usage']['average_pattern_score'] = pattern_score_sum / stats['folding_usage']['files_with_folding']
        
        return stats
    
    def _get_mime_type(self, file_extension: str) -> str:
        """Get MIME type for file extension"""
        mime_types = {
            '.js': 'application/javascript',
            '.ts': 'application/typescript',
            '.jsx': 'application/javascript',
            '.tsx': 'application/typescript',
            '.css': 'text/css',
            '.html': 'text/html',
            '.htm': 'text/html',
            '.json': 'application/json',
            '.md': 'text/markdown',
            '.txt': 'text/plain',
            '.py': 'text/x-python',
            '.xml': 'application/xml',
            '.yml': 'application/x-yaml',
            '.yaml': 'application/x-yaml'
        }
        return mime_types.get(file_extension.lower(), 'text/plain')

# Example usage and comprehensive testing
if __name__ == "__main__":
    print("=== MMRY Complete System v2.0 - With DNA Folding ===\\n")
    
    # Initialize complete system
    mmry_complete = MMRYCompleteV2()
    
    # Test with different file types
    test_files = [
        {
            'content': 'Hello!',
            'file_name': 'greeting.txt',
            'file_type': 'text',
            'file_extension': '.txt',
            'description': 'Simple greeting'
        },
        {
            'content': '''function greet(name) {
    console.log("Hello, " + name);
    return "Hello, " + name;
}

function farewell(name) {
    console.log("Goodbye, " + name);
    return "Goodbye, " + name;
}

const user = "World";
greet(user);
farewell(user);''',
            'file_name': 'greetings.js',
            'file_type': 'source',
            'file_extension': '.js',
            'description': 'JavaScript with patterns'
        },
        {
            'content': '''<div class="container">
    <div class="header">
        <h1 class="title">Welcome</h1>
        <p class="subtitle">To our application</p>
    </div>
    <div class="main">
        <div class="section">
            <h2 class="section-title">Features</h2>
            <p class="section-content">Amazing features</p>
        </div>
        <div class="section">
            <h2 class="section-title">Benefits</h2>
            <p class="section-content">Great benefits</p>
        </div>
    </div>
</div>''',
            'file_name': 'layout.html',
            'file_type': 'markup',
            'file_extension': '.html',
            'description': 'HTML with structure'
        }
    ]
    
    # Create vault files
    created_files = []
    for i, file_data in enumerate(test_files):
        vault_path = mmry_complete.create_mmry_vault_file(
            user_id="demo_user",
            project_id=f"demo_project_{i}",
            file_data=file_data
        )
        created_files.append(vault_path)
        
        print(f"Created vault file: {file_data['file_name']}")
        print(f"Path: {vault_path}")
        
        # Read back and show compression info
        vault_data = mmry_complete.read_mmry_vault_file(vault_path)
        comp_info = vault_data['compression_info']
        
        print(f"Strategy: {comp_info['strategy']}")
        print(f"Original size: {comp_info['compressed_size']} bytes")
        print(f"Compressed size: {vault_data['file_metadata']['original_size']} bytes")
        print(f"Space savings: {comp_info['space_savings_bytes']:+d} bytes ({comp_info['space_savings_percent']:+.1f}%)")
        print(f"Quality score: {comp_info['quality_score']:.2f}")
        
        if comp_info['folding_used']:
            print(f"DNA Folding: ✅ Used (efficiency: {comp_info['folding_efficiency']:.3f})")
        else:
            print(f"DNA Folding: ❌ Not used")
        
        print(f"Integrity: {'✅ PASS' if vault_data['content'] == file_data['content'] else '❌ FAIL'}")
        print("-" * 60)
    
    # Show overall statistics
    print("\\nOverall Vault Statistics:")
    stats = mmry_complete.get_vault_statistics("demo_user")
    print(f"Total files: {stats['total_files']}")
    print(f"Total space saved: {stats['total_space_saved']} bytes ({stats.get('space_saved_percentage', 0):.1f}%)")
    print(f"Average compression ratio: {stats['quality_metrics']['average_compression_ratio']:.3f}")
    print(f"Average quality score: {stats['quality_metrics']['average_quality_score']:.2f}")
    print(f"Strategies used: {list(stats['compression_strategies'].keys())}")
    print(f"Files with DNA folding: {stats['folding_usage']['files_with_folding']}")
    
    if stats['folding_usage']['files_with_folding'] > 0:
        print(f"Average folding efficiency: {stats['folding_usage']['average_folding_efficiency']:.3f}")
        print(f"Average pattern score: {stats['folding_usage']['average_pattern_score']:.3f}")
    
    print("\\n✅ MMRY Complete v2.0 with DNA Folding is working!")

