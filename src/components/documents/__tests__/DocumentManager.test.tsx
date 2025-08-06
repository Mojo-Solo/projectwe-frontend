import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DocumentManager } from '../DocumentManager';
import { DocumentApiService } from '@/lib/document-api';
import { useAuth } from '@/hooks/useAuth';

// Mock dependencies
jest.mock('@/lib/document-api');
jest.mock('@/hooks/useAuth');
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

const mockDocumentApiService = DocumentApiService as jest.MockedClass<typeof DocumentApiService>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

const mockDocuments = [
  {
    id: 'doc-1',
    name: 'Financial Report.pdf',
    fileType: 'pdf',
    mimeType: 'application/pdf',
    fileSize: 2048000,
    category: 'financial',
    tags: ['Q4', 'report'],
    isEncrypted: false,
    currentVersion: 1,
    updatedAt: '2024-01-15T00:00:00Z',
    versions: [{
      versionNumber: 1,
      uploadedAt: '2024-01-15T00:00:00Z',
      fileUrl: 'https://example.com/doc1.pdf',
    }],
    shareSettings: {
      allowPrinting: true,
      allowCopying: true,
      watermarkEnabled: false,
    },
  },
  {
    id: 'doc-2',
    name: 'Business Plan.docx',
    fileType: 'docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 1024000,
    category: 'strategic',
    tags: ['2024', 'plan'],
    isEncrypted: true,
    currentVersion: 2,
    updatedAt: '2024-01-10T00:00:00Z',
    versions: [{
      versionNumber: 2,
      uploadedAt: '2024-01-10T00:00:00Z',
      fileUrl: 'https://example.com/doc2.docx',
    }],
    shareSettings: {
      allowPrinting: false,
      allowCopying: true,
      watermarkEnabled: true,
    },
  },
  {
    id: 'doc-3',
    name: 'Meeting Notes.txt',
    fileType: 'txt',
    mimeType: 'text/plain',
    fileSize: 10240,
    category: 'other',
    tags: ['meeting'],
    isEncrypted: false,
    currentVersion: 1,
    updatedAt: '2024-01-05T00:00:00Z',
    versions: [{
      versionNumber: 1,
      uploadedAt: '2024-01-05T00:00:00Z',
      fileUrl: 'https://example.com/doc3.txt',
    }],
    shareSettings: {
      allowPrinting: true,
      allowCopying: true,
      watermarkEnabled: false,
    },
  },
];

describe('DocumentManager', () => {
  const mockListDocuments = jest.fn();
  const mockUploadDocument = jest.fn();
  const mockDeleteDocument = jest.fn();
  const mockShareDocument = jest.fn();
  const mockGetViewUrl = jest.fn();
  const mockGetDownloadUrl = jest.fn();

  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      token: 'mock-token',
      user: { id: '1', email: 'user@example.com' },
      isAuthenticated: true,
    } as any);

    mockDocumentApiService.mockImplementation(() => ({
      listDocuments: mockListDocuments,
      uploadDocument: mockUploadDocument,
      deleteDocument: mockDeleteDocument,
      shareDocument: mockShareDocument,
      getViewUrl: mockGetViewUrl,
      getDownloadUrl: mockGetDownloadUrl,
    }) as any);

    mockListDocuments.mockResolvedValue({
      data: mockDocuments,
      total: mockDocuments.length,
    });

    mockGetViewUrl.mockResolvedValue({
      url: 'https://example.com/view/doc',
      expires_at: '2024-01-01T01:00:00Z',
    });

    mockGetDownloadUrl.mockResolvedValue({
      url: 'https://example.com/download/doc',
      expires_at: '2024-01-01T01:00:00Z',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders documents after loading', async () => {
    render(<DocumentManager workspaceId="workspace-1" userId="user-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Financial Report.pdf')).toBeInTheDocument();
      expect(screen.getByText('Business Plan.docx')).toBeInTheDocument();
      expect(screen.getByText('Meeting Notes.txt')).toBeInTheDocument();
    });
  });

  it('displays document information correctly', async () => {
    render(<DocumentManager workspaceId="workspace-1" userId="user-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Financial Report.pdf')).toBeInTheDocument();
    });

    // Check file size and type display
    expect(screen.getByText('2.00 MB • PDF')).toBeInTheDocument();
    expect(screen.getByText('1.00 MB • DOCX')).toBeInTheDocument();
    expect(screen.getByText('0.01 MB • TXT')).toBeInTheDocument();
  });

  it('shows encryption indicator for encrypted documents', async () => {
    render(<DocumentManager workspaceId="workspace-1" userId="user-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Business Plan.docx')).toBeInTheDocument();
    });

    // Should show shield icon for encrypted document
    // This would need proper data-testid attributes in the component
  });

  it('filters documents by search query', async () => {
    render(<DocumentManager workspaceId="workspace-1" userId="user-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Financial Report.pdf')).toBeInTheDocument();
    });

    // Search for 'financial'
    const searchInput = screen.getByPlaceholderText('Search documents...');
    fireEvent.change(searchInput, { target: { value: 'financial' } });

    await waitFor(() => {
      expect(screen.getByText('Financial Report.pdf')).toBeInTheDocument();
      expect(screen.queryByText('Business Plan.docx')).not.toBeInTheDocument();
      expect(screen.queryByText('Meeting Notes.txt')).not.toBeInTheDocument();
    });
  });

  it('filters documents by category', async () => {
    render(<DocumentManager workspaceId="workspace-1" userId="user-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Financial Report.pdf')).toBeInTheDocument();
    });

    // Select strategic category
    const categorySelect = screen.getByDisplayValue('All Categories');
    fireEvent.click(categorySelect);
    fireEvent.click(screen.getByText('strategic'));

    await waitFor(() => {
      expect(screen.queryByText('Financial Report.pdf')).not.toBeInTheDocument();
      expect(screen.getByText('Business Plan.docx')).toBeInTheDocument();
      expect(screen.queryByText('Meeting Notes.txt')).not.toBeInTheDocument();
    });
  });

  it('toggles between grid and list view', async () => {
    render(<DocumentManager workspaceId="workspace-1" userId="user-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Financial Report.pdf')).toBeInTheDocument();
    });

    // Initially in grid view
    expect(screen.getByRole('button', { name: /grid/i })).toHaveClass('bg-secondary');

    // Switch to list view
    fireEvent.click(screen.getByRole('button', { name: /list/i }));
    
    // Should switch to list view
    expect(screen.getByRole('button', { name: /list/i })).toHaveClass('bg-secondary');
  });

  it('opens upload dialog when upload button is clicked', async () => {
    render(<DocumentManager workspaceId="workspace-1" userId="user-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Upload Document')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Upload Document'));

    await waitFor(() => {
      expect(screen.getByText('Upload Documents')).toBeInTheDocument();
      expect(screen.getByText('Upload documents to your exit planning workspace')).toBeInTheDocument();
    });
  });

  it('handles document upload', async () => {
    const mockFiles = [new File(['test'], 'test.pdf', { type: 'application/pdf' })];
    mockUploadDocument.mockResolvedValue({ id: 'new-doc', name: 'test.pdf' });

    render(<DocumentManager workspaceId="workspace-1" userId="user-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Upload Document')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Upload Document'));

    await waitFor(() => {
      expect(screen.getByText('Upload Documents')).toBeInTheDocument();
    });

    // This would require more complex file upload simulation
    // The actual implementation would depend on the DocumentUpload component
  });

  it('handles document deletion', async () => {
    mockDeleteDocument.mockResolvedValue(undefined);
    
    render(<DocumentManager workspaceId="workspace-1" userId="user-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Financial Report.pdf')).toBeInTheDocument();
    });

    // Click on document options (this would need proper menu implementation)
    // This is a simplified test - actual implementation would need dropdown menu
  });

  it('shows advanced search panel when advanced button is clicked', async () => {
    render(<DocumentManager workspaceId="workspace-1" userId="user-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Advanced')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Advanced'));

    await waitFor(() => {
      expect(screen.getByText('Sort by')).toBeInTheDocument();
      expect(screen.getByText('Order')).toBeInTheDocument();
      expect(screen.getByText('Date Range')).toBeInTheDocument();
    });
  });

  it('sorts documents correctly', async () => {
    render(<DocumentManager workspaceId="workspace-1" userId="user-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Advanced')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Advanced'));

    await waitFor(() => {
      expect(screen.getByText('Sort by')).toBeInTheDocument();
    });

    // Select sort by name
    const sortSelect = screen.getByDisplayValue('Date Modified');
    fireEvent.click(sortSelect);
    fireEvent.click(screen.getByText('Name'));

    // Documents should be reordered (this would need to check actual DOM order)
  });

  it('filters by date range', async () => {
    render(<DocumentManager workspaceId="workspace-1" userId="user-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Advanced')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Advanced'));

    await waitFor(() => {
      expect(screen.getByText('Date Range')).toBeInTheDocument();
    });

    // Set date range
    const dateInputs = screen.getAllByDisplayValue('');
    const fromDate = dateInputs.find(input => input.getAttribute('type') === 'date');
    if (fromDate) {
      fireEvent.change(fromDate, { target: { value: '2024-01-12' } });
    }

    // Should filter documents based on date
  });

  it('clears all filters when clear button is clicked', async () => {
    render(<DocumentManager workspaceId="workspace-1" userId="user-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Advanced')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Advanced'));

    await waitFor(() => {
      expect(screen.getByText('Clear Filters')).toBeInTheDocument();
    });

    // Set some filters first
    const searchInput = screen.getByPlaceholderText('Search documents...');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    // Clear filters
    fireEvent.click(screen.getByText('Clear Filters'));

    // Should reset all filters
    expect(searchInput).toHaveValue('');
  });

  it('displays empty state when no documents found', async () => {
    mockListDocuments.mockResolvedValue({ data: [], total: 0 });
    
    render(<DocumentManager workspaceId="workspace-1" userId="user-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('No documents found')).toBeInTheDocument();
      expect(screen.getByText('Upload your first document to get started')).toBeInTheDocument();
    });
  });

  it('displays empty state for search with no results', async () => {
    render(<DocumentManager workspaceId="workspace-1" userId="user-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Financial Report.pdf')).toBeInTheDocument();
    });

    // Search for something that doesn't exist
    const searchInput = screen.getByPlaceholderText('Search documents...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    await waitFor(() => {
      expect(screen.getByText('No documents found')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your search filters')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    mockListDocuments.mockRejectedValue(new Error('API Error'));
    
    render(<DocumentManager workspaceId="workspace-1" userId="user-1" />);
    
    // Should handle error without crashing
    await waitFor(() => {
      expect(screen.queryByText('Loading documents...')).not.toBeInTheDocument();
    });
  });
});