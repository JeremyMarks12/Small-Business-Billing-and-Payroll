package com.SBA.BillingSystem;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "workOrderDocument")
public class WorkOrderDocument {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int documentID;

    private int workOrderID;

    private String fileName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentType documentType;

    @Lob
    private byte[] documentData;

    @Column(nullable = false)
    private LocalDateTime uploadDateTime = LocalDateTime.now();

    private int uploadedByWorkerID;
    
    @Column(nullable = false)
    private String mimeType;
    
    private long fileSize;
    
    public WorkOrderDocument() {}
    
    public WorkOrderDocument(int documentID, 
    		int workOrderID, 
    		String fileName, 
    		DocumentType documentType, 
    		byte[] documentData, 
    		LocalDateTime uploadDateTime, 
    		int uploadedByWorkerID,
    		String mimeType,
    		long fileSize) 
    {
    	this.documentID = documentID;
    	this.workOrderID=workOrderID;
    	this.fileName=fileName;
    	this.documentType = documentType;
    	this.documentData = documentData;
    	this.uploadDateTime=uploadDateTime;
    	this.uploadedByWorkerID=uploadedByWorkerID;
    	this.mimeType = mimeType;
    	this.fileSize=fileSize;
    	
    }
    
	public int getDocumentID() {
		return documentID;
	}
	
	public int getWorkOrderID() {
		return workOrderID;
	}
	
	public String getFileName() {
		return fileName;
	}

    public DocumentType getDocumentType() {
    	return documentType;
    }
	
	public byte[] getDocumentData() {
	    return documentData;
	}
	
	public LocalDateTime getUploadDateTime() {
		return uploadDateTime;
	}
	
	public int getUploadedByWorkerID() {
		return uploadedByWorkerID;
	}
	
	public String getMimeType() {
		return mimeType;
	}
	
	public long getFileSize() {
		return fileSize;
	}
	
	public void setDocumentID(int documentID) {
		this.documentID = documentID;
	}
	
	public void setWorkOrderID(int workOrderID) {
		this.workOrderID = workOrderID;
	}
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

    public void setDocumentType(DocumentType documentType) {
    	this.documentType = documentType;
    }
    
	public void setDocumentData(byte[] documentData) {
	    this.documentData = documentData;
	}

	public void setUploadDateTime(LocalDateTime uploadDateTime) {
		this.uploadDateTime = uploadDateTime;
	}

	public void setUploadedByWorkerID(int uploadedByWorkerID) {
		this.uploadedByWorkerID = uploadedByWorkerID;
	}
	
	public void setMimeType(String mimeType) {
		this.mimeType = mimeType;
	}

	public void setFileSize(long fileSize) {
		this.fileSize = fileSize;
	}
}
