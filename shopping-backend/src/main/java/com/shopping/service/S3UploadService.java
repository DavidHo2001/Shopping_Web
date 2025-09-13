package com.shopping.service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.UUID;

@Service
public class S3UploadService {

    private final S3Client s3Client;
    public S3UploadService(S3Client s3Client) {
        this.s3Client = s3Client;
    }
    
    @Value("${aws.s3.bucket}")
    private String bucket;

    @Value("${aws.s3.public-base-url}")
    private String publicBaseUrl;

    @Value("${aws.s3.folder-prefix:products/}")
    private String folderPrefix;

    public String uploadProductImage(MultipartFile file, String productName) throws IOException {

        String safeName = "Glasy" + Character.toUpperCase(productName.charAt(0)) + productName.substring(1).toLowerCase();

        String originalExt = extractExtension(file.getOriginalFilename());
        /*String key = folderPrefix +
                safeName + "-" + Instant.now().toEpochMilli() +
                "-" + UUID.randomUUID().toString().substring(0,8) +
                (originalExt.isEmpty() ? "" : "." + originalExt);*/
        String key = folderPrefix + safeName + (originalExt.isEmpty() ? "" : "." + originalExt);

        PutObjectRequest putReq = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType(file.getContentType())
                .acl(ObjectCannedACL.PUBLIC_READ)
                .build();

        try {
            s3Client.putObject(putReq, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
        } catch (S3Exception e) {
            throw new IOException("S3 upload failed: " + e.awsErrorDetails().errorMessage(), e);
        }

        return buildPublicUrl(key);
    }

    //prevent double slashes
    private String buildPublicUrl(String key) {
        return publicBaseUrl.endsWith("/") ? publicBaseUrl + key : publicBaseUrl + "/" + key;
    }

    private String extractExtension(String filename) {
        if (filename == null) return "";
        int dot = filename.lastIndexOf('.');
        if (dot == -1 || dot == filename.length() - 1) return "";
        return filename.substring(dot + 1).toLowerCase();
    }

    public void deleteImageByUrl(String imageUrl) {
        // Optional: parse key from stored URL and delete
        if (imageUrl == null || imageUrl.isEmpty()) return;
        String key;
        if (imageUrl.startsWith(publicBaseUrl)) {
            key = imageUrl.substring(publicBaseUrl.length());
            if (key.startsWith("/")) key = key.substring(1);
        } else {
            // If only key was stored
            key = imageUrl;
        }
        s3Client.deleteObject(DeleteObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build());
    }
}