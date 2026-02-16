
using Amazon.Runtime;
using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/upload")]
public class UploadController : ControllerBase
{
    private readonly IAmazonS3 _s3Client;

    public UploadController(IAmazonS3 s3Client)
    {
        _s3Client = s3Client;
    }

    public class PresignedUrlRequest
    {
        public string? FileName { get; set; }
        public string? FileType { get; set; }
    }

    [HttpPost("presigned-url")]
    public IActionResult GetPresignedUrl([FromBody] PresignedUrlRequest requestBody)
    {
        if (string.IsNullOrEmpty(requestBody.FileName) || string.IsNullOrEmpty(requestBody.FileType))
            return BadRequest("Missing file name or file type");

        if (requestBody.FileType.ToLower() != "video/mp4")
            return BadRequest("Only MP4 videos are supported");

        var uniqueFileName = $"{Guid.NewGuid()}_{requestBody.FileName}";

        var request = new GetPreSignedUrlRequest
        {
            BucketName = "vidshare.aws-testpnoren",
            Key = uniqueFileName,
            Verb = HttpVerb.PUT,
            Expires = DateTime.UtcNow.AddMinutes(10),
            //ContentType = requestBody.FileType
           // ContentType = "video/mp4"
        };

        var url = _s3Client.GetPreSignedURL(request);

        return Ok(new
        {
            url,
            key = uniqueFileName
        });
    }
    [HttpGet("test-s3")]
    [AllowAnonymous]
    public async Task<IActionResult> TestS3()
    {
        try
        {
            // בדיקה 1: האם אפשר לרשום רשימת קבצים
            var listRequest = new ListObjectsV2Request
            {
                BucketName = "vidshare.aws-testpnoren",
                MaxKeys = 1
            };
            var listResponse = await _s3Client.ListObjectsV2Async(listRequest);

            // בדיקה 2: האם אפשר להעלות קובץ
            var putRequest = new PutObjectRequest
            {
                BucketName = "vidshare.aws-testpnoren",
                Key = "test-upload.txt",
                ContentBody = "Test from API",
                CannedACL = S3CannedACL.PublicRead
            };
            await _s3Client.PutObjectAsync(putRequest);

            return Ok(new
            {
                message = "S3 works perfectly!",
                listCount = listResponse.S3Objects.Count,
                testFileUrl = "https://vidshare.aws-testpnoren.s3.eu-north-1.amazonaws.com/test-upload.txt"
            });
        }
        catch (AmazonS3Exception s3Ex)
        {
            return BadRequest(new
            {
                error = "S3 Error",
                message = s3Ex.Message,
                errorCode = s3Ex.ErrorCode,
                statusCode = (int)s3Ex.StatusCode
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                error = "Error",
                message = ex.Message
            });
        }
    }
    [HttpGet("check-config")]
    [AllowAnonymous]
    public IActionResult CheckConfig([FromServices] IConfiguration config)
    {
        var accessKey = config["AWS:AccessKey"];
        var secretKey = config["AWS:SecretKey"];

        return Ok(new
        {
            hasAccessKey = !string.IsNullOrEmpty(accessKey),
            accessKeyStart = accessKey?.Substring(0, 4),
            accessKeyLength = accessKey?.Length,
            hasSecretKey = !string.IsNullOrEmpty(secretKey),
            secretKeyLength = secretKey?.Length,
            region = config["AWS:Region"]
        });
    }
    [HttpGet("debug-credentials")]
    public IActionResult DebugCredentials([FromServices] IConfiguration config)
    {
        var awsSection = config.GetSection("AWS");
        var accessKey = awsSection["AWS:AccessKey"];
        var secretKey = awsSection["AWS:SecretKey"];

        return Ok(new
        {
            accessKeyExists = !string.IsNullOrEmpty(accessKey),
            accessKeyPrefix = accessKey?.Substring(0, Math.Min(4, accessKey.Length)),
            accessKeyLength = accessKey?.Length ?? 0,
            secretKeyExists = !string.IsNullOrEmpty(secretKey),
            secretKeyLength = secretKey?.Length ?? 0,
            region = awsSection["AWS:Region"]
        });
    }
    [HttpGet("test-credentials")]
    [AllowAnonymous]
    public IActionResult TestCredentials([FromServices] IConfiguration config)
    {
        var accessKey = config["AWS:AccessKey"];
        var secretKey = config["AWS:SecretKey"];
        var region = config["AWS:Region"];

        // נסה ליצור client ידנית
        try
        {
            var credentials = new BasicAWSCredentials(accessKey, secretKey);
            var s3Client = new AmazonS3Client(credentials, RegionEndpoint.GetBySystemName(region));

            return Ok(new
            {
                message = "Client created successfully",
                accessKeyUsed = accessKey,
                regionUsed = region
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                error = ex.Message,
                accessKey = accessKey?.Substring(0, 10),
                secretKeyLength = secretKey?.Length
            });
        }
    }
    [HttpGet("test-bucket-exists")]
    [AllowAnonymous]
    public async Task<IActionResult> TestBucketExists()
    {
        try
        {
            var bucketName = "vidshare.aws-testpnoren";

            // בדיקה: האם ה-Bucket קיים?
            var request = new Amazon.S3.Model.GetBucketLocationRequest
            {
                BucketName = bucketName
            };

            var response = await _s3Client.GetBucketLocationAsync(request);

            return Ok(new
            {
                message = "Bucket exists!",
                bucketName = bucketName,
                location = response.Location.Value,
                region = _s3Client.Config.RegionEndpoint.SystemName
            });
        }
        catch (AmazonS3Exception s3Ex)
        {
            return BadRequest(new
            {
                error = "Bucket Error",
                message = s3Ex.Message,
                errorCode = s3Ex.ErrorCode,
                statusCode = (int)s3Ex.StatusCode
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                error = ex.Message
            });
        }
    }

}
