'use client';

import { useEffect, useState } from 'react';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Button, Spinner, Pagination } from '@heroui/react';

interface Item {
  id: number;
  name: string;
  description: string;
}

interface ConnectionTestResult {
  success: boolean;
  message: string;
  error?: any;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Item>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionResult, setConnectionResult] = useState<ConnectionTestResult | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/items');
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setTestingConnection(true);
    setConnectionResult(null);
    try {
      const response = await fetch('/api/test-connection');
      const result = await response.json();
      setConnectionResult(result);
    } catch (err) {
      setConnectionResult({
        success: false,
        message: err instanceof Error ? err.message : 'Unknown error',
        error: err
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSort = (field: keyof Item) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    if (sortField === 'id') {
      return sortDirection === 'asc' ? a.id - b.id : b.id - a.id;
    } else {
      const aValue = a[sortField].toString().toLowerCase();
      const bValue = b[sortField].toString().toLowerCase();
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Items List</h1>
          <div className="flex gap-4">
            <Button 
              color="primary" 
              onPress={testConnection}
              isLoading={testingConnection}
            >
              Test Connection
            </Button>
            <Button 
              color="secondary" 
              onPress={fetchItems}
              isLoading={loading}
            >
              Refresh Data
            </Button>
          </div>
        </div>
        
        {connectionResult && (
          <div className={`mb-6 p-4 rounded-lg ${connectionResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <h3 className="font-semibold">{connectionResult.success ? 'Connection Successful' : 'Connection Failed'}</h3>
            <p>{connectionResult.message}</p>
            {!connectionResult.success && connectionResult.error && (
              <pre className="mt-2 text-xs overflow-auto p-2 bg-red-100 rounded">
                {JSON.stringify(connectionResult.error, null, 2)}
              </pre>
            )}
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-800">
            <h3 className="font-semibold">Error</h3>
            <p>{error}</p>
          </div>
        )}
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <Table 
            aria-label="Items table"
            className="min-w-full"
            classNames={{
              wrapper: "min-h-[222px]",
              th: "bg-gray-50 text-gray-600 font-medium text-sm py-3 px-4 text-left",
              td: "py-3 px-4 text-sm text-gray-800 border-b border-gray-100",
              tr: "hover:bg-gray-50 transition-colors",
              thead: "border-b border-gray-200",
              tbody: "divide-y divide-gray-100"
            }}
          >
            <TableHeader>
              <TableColumn 
                className="cursor-pointer"
                onClick={() => handleSort('id')}
              >
                ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableColumn>
              <TableColumn 
                className="cursor-pointer"
                onClick={() => handleSort('name')}
              >
                Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableColumn>
              <TableColumn 
                className="cursor-pointer"
                onClick={() => handleSort('description')}
              >
                Description {sortField === 'description' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableColumn>
            </TableHeader>
            <TableBody>
              {paginatedItems.length > 0 ? (
                paginatedItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                    No items found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {totalPages > 1 && (
            <div className="flex justify-center py-4 border-t border-gray-200">
              <Pagination
                total={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                showControls
                classNames={{
                  wrapper: "gap-1",
                  item: "w-8 h-8 text-sm hover:cursor-pointer transition-colors",
                  cursor: "bg-blue-500 text-white font-medium",
                  next: "hover:cursor-pointer",
                  prev: "hover:cursor-pointer"
                }}
              />
            </div>
          )}
        </div>
      </div>
      

    </div>
  );
}
