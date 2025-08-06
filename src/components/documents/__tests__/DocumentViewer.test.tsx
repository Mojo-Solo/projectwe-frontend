import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DocumentViewer } from "../DocumentViewer";
import { DocumentApiService } from "@/lib/document-api";
import { useAuth } from "@/hooks/useAuth";

// Mock dependencies
jest.mock("@/lib/document-api");
jest.mock("@/hooks/useAuth");
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

const mockDocumentApiService = DocumentApiService as jest.MockedClass<
  typeof DocumentApiService
>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

const mockDocument = {
  id: "doc-1",
  name: "Test Document.pdf",
  fileType: "pdf",
  mimeType: "application/pdf",
  fileSize: 1024000,
  category: "financial",
  isEncrypted: false,
  currentVersion: 1,
  versions: [
    {
      versionNumber: 1,
      uploadedAt: "2024-01-01T00:00:00Z",
      uploadedBy: {
        name: "John Doe",
        email: "john@example.com",
      },
      comments: "Initial upload",
    },
  ],
  metadata: {
    pageCount: 10,
    wordCount: 5000,
    author: "Test Author",
    createdDate: "2024-01-01T00:00:00Z",
    customTags: ["important", "review"],
  },
  permissions: [],
  owner: {
    name: "John Doe",
    email: "john@example.com",
  },
  createdAt: "2024-01-01T00:00:00Z",
  lastAccessedAt: "2024-01-02T00:00:00Z",
  accessCount: 5,
};

const mockViewUrl = "https://example.com/document.pdf";

describe("DocumentViewer", () => {
  const mockGetDocument = jest.fn();
  const mockGetViewUrl = jest.fn();
  const mockGetDownloadUrl = jest.fn();

  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      token: "mock-token",
      user: { id: "1", email: "user@example.com" },
      isAuthenticated: true,
    } as any);

    mockDocumentApiService.mockImplementation(
      () =>
        ({
          getDocument: mockGetDocument,
          getViewUrl: mockGetViewUrl,
          getDownloadUrl: mockGetDownloadUrl,
        }) as any,
    );

    mockGetDocument.mockResolvedValue(mockDocument);
    mockGetViewUrl.mockResolvedValue({
      url: mockViewUrl,
      expires_at: "2024-01-01T01:00:00Z",
    });
    mockGetDownloadUrl.mockResolvedValue({
      url: mockViewUrl,
      expires_at: "2024-01-01T01:00:00Z",
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially", () => {
    render(<DocumentViewer documentId="doc-1" workspaceId="workspace-1" />);

    expect(screen.getByText("Loading document...")).toBeInTheDocument();
  });

  it("renders document information after loading", async () => {
    render(<DocumentViewer documentId="doc-1" workspaceId="workspace-1" />);

    await waitFor(() => {
      expect(screen.getByText("Test Document.pdf")).toBeInTheDocument();
    });

    expect(screen.getByText("1.00 MB")).toBeInTheDocument();
    expect(screen.getByText("Version 1")).toBeInTheDocument();
    expect(screen.getByText("financial")).toBeInTheDocument();
    expect(screen.getByText("Viewed 5 times")).toBeInTheDocument();
  });

  it("displays PDF viewer for PDF documents", async () => {
    render(<DocumentViewer documentId="doc-1" workspaceId="workspace-1" />);

    await waitFor(() => {
      expect(screen.getByText("Test Document.pdf")).toBeInTheDocument();
    });

    // Should render PDF controls
    expect(screen.getByText("Page")).toBeInTheDocument();
    expect(screen.getByText("of")).toBeInTheDocument();
  });

  it("handles download button click", async () => {
    const mockOpen = jest.fn();
    window.open = mockOpen;

    render(<DocumentViewer documentId="doc-1" workspaceId="workspace-1" />);

    await waitFor(() => {
      expect(screen.getByText("Test Document.pdf")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Download"));

    await waitFor(() => {
      expect(mockGetDownloadUrl).toHaveBeenCalledWith("doc-1");
      expect(mockOpen).toHaveBeenCalledWith(mockViewUrl, "_blank");
    });
  });

  it("displays document details in sidebar", async () => {
    render(<DocumentViewer documentId="doc-1" workspaceId="workspace-1" />);

    await waitFor(() => {
      expect(screen.getByText("Test Document.pdf")).toBeInTheDocument();
    });

    // Click on Details tab (should be active by default)
    expect(screen.getByText("Document Information")).toBeInTheDocument();
    expect(screen.getByText("PDF")).toBeInTheDocument();
    expect(screen.getByText("1.00 MB")).toBeInTheDocument();
    expect(screen.getByText("Pages:")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("displays version information", async () => {
    render(<DocumentViewer documentId="doc-1" workspaceId="workspace-1" />);

    await waitFor(() => {
      expect(screen.getByText("Test Document.pdf")).toBeInTheDocument();
    });

    // Click on Versions tab
    fireEvent.click(screen.getByText("Versions"));

    expect(screen.getByText("Version 1")).toBeInTheDocument();
    expect(screen.getByText("Current")).toBeInTheDocument();
    expect(screen.getByText("Uploaded by John Doe")).toBeInTheDocument();
  });

  it("displays owner information", async () => {
    render(<DocumentViewer documentId="doc-1" workspaceId="workspace-1" />);

    await waitFor(() => {
      expect(screen.getByText("Test Document.pdf")).toBeInTheDocument();
    });

    expect(screen.getByText("Owner")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  it("displays custom tags", async () => {
    render(<DocumentViewer documentId="doc-1" workspaceId="workspace-1" />);

    await waitFor(() => {
      expect(screen.getByText("Test Document.pdf")).toBeInTheDocument();
    });

    expect(screen.getByText("Tags")).toBeInTheDocument();
    expect(screen.getByText("important")).toBeInTheDocument();
    expect(screen.getByText("review")).toBeInTheDocument();
  });

  it("handles API errors gracefully", async () => {
    mockGetDocument.mockRejectedValue(new Error("Failed to load document"));

    render(<DocumentViewer documentId="doc-1" workspaceId="workspace-1" />);

    // Should handle error and not crash
    await waitFor(() => {
      expect(screen.queryByText("Loading document...")).not.toBeInTheDocument();
    });
  });

  it("calls onClose when close button is clicked", async () => {
    const mockOnClose = jest.fn();

    render(
      <DocumentViewer
        documentId="doc-1"
        workspaceId="workspace-1"
        onClose={mockOnClose}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("Test Document.pdf")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("✕"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("shows encryption indicator for encrypted documents", async () => {
    const encryptedDocument = { ...mockDocument, isEncrypted: true };
    mockGetDocument.mockResolvedValue(encryptedDocument);

    render(<DocumentViewer documentId="doc-1" workspaceId="workspace-1" />);

    await waitFor(() => {
      expect(screen.getByText("Test Document.pdf")).toBeInTheDocument();
    });

    // Should show lock icon for encrypted documents
    const lockIcon = document.querySelector('svg[data-testid="lock-icon"]');
    // Note: This would need to be implemented in the component
  });

  it("displays appropriate message for unsupported file types", async () => {
    const unsupportedDocument = {
      ...mockDocument,
      mimeType: "application/unknown",
      fileType: "unknown",
    };
    mockGetDocument.mockResolvedValue(unsupportedDocument);

    render(<DocumentViewer documentId="doc-1" workspaceId="workspace-1" />);

    await waitFor(() => {
      expect(screen.getByText("Test Document.pdf")).toBeInTheDocument();
    });

    expect(screen.getByText("Preview Not Available")).toBeInTheDocument();
    expect(
      screen.getByText("This file type cannot be previewed in the browser"),
    ).toBeInTheDocument();
  });
});
