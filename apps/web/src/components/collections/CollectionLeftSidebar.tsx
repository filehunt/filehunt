"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SmartRule, Collection } from '@/types/assets';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select';
import { Badge } from '@/components/badge';
import { 
  Plus, 
  Zap, 
  X, 
  Filter, 
  FolderPlus, 
  Trash2,
  Settings,
  Save
} from 'lucide-react';

interface SmartFolder {
  id: string;
  name: string;
  description?: string;
  rules: SmartRule[];
  color?: string;
  isActive: boolean;
}

interface CollectionLeftSidebarProps {
  onCollectionCreated?: (collection: Collection) => void;
}

export function CollectionLeftSidebar({ onCollectionCreated }: CollectionLeftSidebarProps) {
  const [smartFolders, setSmartFolders] = useState<SmartFolder[]>([
    {
      id: '1',
      name: 'Recent Images',
      description: 'Images uploaded in the last 7 days',
      rules: [
        {
          id: '1',
          field: 'type',
          operator: 'equals',
          value: 'image',
          logic: 'AND'
        },
        {
          id: '2',
          field: 'createdAt',
          operator: 'greaterThan',
          value: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ],
      color: '#10B981',
      isActive: true
    },
    {
      id: '2',
      name: 'Large Files',
      description: 'Files larger than 10MB',
      rules: [
        {
          id: '3',
          field: 'size',
          operator: 'greaterThan',
          value: 10485760
        }
      ],
      color: '#F59E0B',
      isActive: true
    }
  ]);

  const [newRule, setNewRule] = useState<Partial<SmartRule>>({
    field: 'tags',
    operator: 'contains',
    value: '',
    logic: 'AND'
  });
  
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [currentRules, setCurrentRules] = useState<SmartRule[]>([]);

  const fieldOptions = [
    { value: 'tags', label: 'Tags' },
    { value: 'name', label: 'Name' },
    { value: 'type', label: 'Type' },
    { value: 'size', label: 'Size' },
    { value: 'createdAt', label: 'Created Date' },
    { value: 'uploadedBy', label: 'Uploaded By' },
    { value: 'folder', label: 'Folder' },
    { value: 'status', label: 'Status' }
  ];

  const operatorOptions = [
    { value: 'contains', label: 'Contains' },
    { value: 'equals', label: 'Equals' },
    { value: 'startsWith', label: 'Starts with' },
    { value: 'endsWith', label: 'Ends with' },
    { value: 'greaterThan', label: 'Greater than' },
    { value: 'lessThan', label: 'Less than' },
    { value: 'in', label: 'In' },
    { value: 'notIn', label: 'Not in' }
  ];

  const logicOptions = [
    { value: 'AND', label: 'AND' },
    { value: 'OR', label: 'OR' }
  ];

  const addRule = () => {
    if (newRule.field && newRule.operator && newRule.value) {
      const rule: SmartRule = {
        id: Math.random().toString(36).substr(2, 9),
        field: newRule.field as any,
        operator: newRule.operator as any,
        value: newRule.value,
        logic: newRule.logic as any
      };
      setCurrentRules(prev => [...prev, rule]);
      setNewRule({
        field: 'tags',
        operator: 'contains',
        value: '',
        logic: 'AND'
      });
    }
  };

  const removeRule = (ruleId: string) => {
    setCurrentRules(prev => prev.filter(rule => rule.id !== ruleId));
  };

  const startEditingFolder = (folder: SmartFolder) => {
    setEditingFolder(folder.id);
    setNewFolderName(folder.name);
    setCurrentRules([...folder.rules]);
  };

  const saveFolder = () => {
    if (!newFolderName.trim() || currentRules.length === 0) return;

    if (editingFolder) {
      // Update existing folder
      setSmartFolders(prev => prev.map(folder => 
        folder.id === editingFolder 
          ? { ...folder, name: newFolderName, rules: [...currentRules] }
          : folder
      ));
    } else {
      // Create new folder
      const newFolder: SmartFolder = {
        id: Math.random().toString(36).substr(2, 9),
        name: newFolderName,
        rules: [...currentRules],
        color: '#6366F1',
        isActive: true
      };
      setSmartFolders(prev => [...prev, newFolder]);
      
      // Create a new Collection object and notify parent
      const newCollection: Collection = {
        id: `smart_collection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Unique ID
        name: newFolder.name,
        type: 'smart',
        description: `Smart collection with ${currentRules.length} rule${currentRules.length > 1 ? 's' : ''}`,
        thumbnailUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop',
        assetCount: Math.floor(Math.random() * 50) + 5, // Random count for demo
        size: Math.floor(Math.random() * 50000000) + 10000000, // Random size for demo
        tags: ['smart', 'auto-generated'],
        color: newFolder.color,
        icon: 'zap',
        isPublic: false,
        smartRules: currentRules,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: {
          id: 'current-user',
          name: 'Sarah Chen',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
          email: 'sarah@filehunt.com'
        },
        collaborators: []
      };
      
      console.log('✅ Creating new Smart Collection:', newCollection.name, 'with ID:', newCollection.id);
      
      // Call the parent handler first
      if (onCollectionCreated) {
        onCollectionCreated(newCollection);
        console.log('✅ Called onCollectionCreated with new collection');
        
        // Show success feedback
        setTimeout(() => {
          console.log('🎉 Smart Collection "' + newCollection.name + '" created successfully!');
        }, 100);
      } else {
        console.warn('❌ onCollectionCreated is not defined');
      }
    }

    // Reset form
    setEditingFolder(null);
    setNewFolderName('');
    setCurrentRules([]);
  };

  const cancelEditing = () => {
    setEditingFolder(null);
    setNewFolderName('');
    setCurrentRules([]);
  };

  const deleteFolder = (folderId: string) => {
    setSmartFolders(prev => prev.filter(folder => folder.id !== folderId));
  };

  const toggleFolder = (folderId: string) => {
    setSmartFolders(prev => prev.map(folder => 
      folder.id === folderId 
        ? { ...folder, isActive: !folder.isActive }
        : folder
    ));
  };

  const getRuleDisplayText = (rule: SmartRule) => {
    return `${rule.field} ${rule.operator} "${rule.value}"`;
  };

  return (
    <div className="w-72 flex flex-col h-full" style={{ backgroundColor: 'transparent' }}>
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-primary" />
          <h2 className="text-white font-semibold text-sm">Smart Collections</h2>
        </div>
      </div>

      {/* Create/Edit Smart Folder Form */}
      <motion.div 
        className="p-4 space-y-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >

        <div className="flex items-center space-x-2">
          <FolderPlus className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-medium text-foreground">
            {editingFolder ? 'Edit Smart Collection' : 'Create Smart Collection'}
          </h3>
        </div>

        <div className="space-y-3">
          <Input
            placeholder="Collection name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            className="text-sm"
          />

          {/* Current Rules */}
          <AnimatePresence>
            {currentRules.length > 0 && (
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <label className="text-xs font-medium text-muted-foreground">
                  Rules ({currentRules.length})
                </label>
                <AnimatePresence>
                  {currentRules.map((rule, index) => (
                    <motion.div 
                      key={rule.id} 
                      className="flex items-center justify-between p-2 bg-muted/30 rounded text-xs"
                      initial={{ opacity: 0, x: -20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 20, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      layout
                    >
                      <div>
                        {index > 0 && (
                          <span className="text-primary font-medium mr-1">
                            {rule.logic}
                          </span>
                        )}
                        <span>{getRuleDisplayText(rule)}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRule(rule.id)}
                        className="h-5 w-5 p-0 text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Add New Rule */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Add Rule
            </label>
            
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={newRule.field}
                onValueChange={(value) => setNewRule(prev => ({ ...prev, field: value as any }))}
              >
                <SelectTrigger className="text-xs h-8">
                  <SelectValue placeholder="Field" />
                </SelectTrigger>
                <SelectContent>
                  {fieldOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={newRule.operator}
                onValueChange={(value) => setNewRule(prev => ({ ...prev, operator: value as any }))}
              >
                <SelectTrigger className="text-xs h-8">
                  <SelectValue placeholder="Operator" />
                </SelectTrigger>
                <SelectContent>
                  {operatorOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Input
              placeholder="Value"
              value={newRule.value}
              onChange={(e) => setNewRule(prev => ({ ...prev, value: e.target.value }))}
              className="text-xs h-8"
            />

            {currentRules.length > 0 && (
              <Select
                value={newRule.logic}
                onValueChange={(value) => setNewRule(prev => ({ ...prev, logic: value as any }))}
              >
                <SelectTrigger className="text-xs h-8">
                  <SelectValue placeholder="Logic" />
                </SelectTrigger>
                <SelectContent>
                  {logicOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Button
              onClick={addRule}
              variant="outline"
              size="sm"
              className="w-full h-8 text-xs"
              disabled={!newRule.field || !newRule.operator || !newRule.value}
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Rule
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pb-4">
            {/* Current state feedback */}
            <div className="text-xs text-muted-foreground">
              {!newFolderName.trim() && "⚡ Enter a collection name"}
              {newFolderName.trim() && currentRules.length === 0 && "📝 Add at least one rule"}
              {newFolderName.trim() && currentRules.length > 0 && "✅ Ready to create collection"}
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={saveFolder}
                size="sm"
                className="flex-1 h-8 text-xs"
                disabled={!newFolderName.trim() || currentRules.length === 0}
              >
                <Save className="w-3 h-3 mr-1" />
                {editingFolder ? 'Update Collection' : 'Create Collection'}
              </Button>
              
              {(editingFolder || newFolderName.trim() || currentRules.length > 0) && (
                <Button
                  onClick={cancelEditing}
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                >
                  {editingFolder ? 'Cancel' : 'Clear'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Smart Folders List */}
      <motion.div 
        className="flex-1 overflow-y-auto p-4 pb-6 space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="flex items-center space-x-2 mb-4">
          <Zap className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-muted-foreground">Existing Collections</h3>
        </div>
        
        <AnimatePresence>
          {smartFolders.map((folder, index) => (
            <motion.div
              key={folder.id}
              className={`p-3 rounded-lg transition-all ${
                folder.isActive 
                  ? 'bg-primary/10 text-primary-foreground' 
                  : 'bg-muted/10 hover:bg-muted/20'
              }`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              layout
            >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: folder.color }}
                />
                <h3 className="text-sm font-medium text-foreground">
                  {folder.name}
                </h3>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFolder(folder.id)}
                  className="h-6 w-6 p-0"
                >
                  <Settings className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => startEditingFolder(folder)}
                  className="h-6 w-6 p-0"
                >
                  <Filter className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteFolder(folder.id)}
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {folder.description && (
              <p className="text-xs text-muted-foreground mb-2">
                {folder.description}
              </p>
            )}

            <div className="space-y-1">
              {folder.rules.map((rule, index) => (
                <div key={rule.id} className="text-xs text-muted-foreground">
                  {index > 0 && (
                    <span className="text-primary font-medium mr-1">
                      {rule.logic}
                    </span>
                  )}
                  <span>{getRuleDisplayText(rule)}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-2 pt-2">
              <Badge 
                variant={folder.isActive ? "default" : "secondary"} 
                className="text-xs"
              >
                {folder.isActive ? 'Active' : 'Inactive'}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Auto-sync enabled
              </span>
            </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
