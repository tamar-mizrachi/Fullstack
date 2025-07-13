/*
using Amazon.S3;
using Amazon.S3.Model;
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
        public string FileName { get; set; }
        public string FileType { get; set; }
    }

    [HttpPost("presigned-url")]
    public IActionResult GetPresignedUrl([FromBody] PresignedUrlRequest requestBody)
    {
        if (string.IsNullOrEmpty(requestBody.FileName) || string.IsNullOrEmpty(requestBody.FileType))
            return BadRequest("Missing file name or file type");

        var uniqueFileName = $"{Guid.NewGuid()}_{requestBody.FileName}";

        var request = new GetPreSignedUrlRequest
        {
            BucketName = "vidshare.aws-testpnoren",
            Key = uniqueFileName,
            Verb = HttpVerb.PUT,
            Expires = DateTime.UtcNow.AddMinutes(10),
            ContentType = requestBody.FileType
        };

        var url = _s3Client.GetPreSignedURL(request);

        return Ok(new
        {
            url,
            key = uniqueFileName
        });
    }
}
*/


using Amazon.S3;
using Amazon.S3.Model;
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
        public string FileName { get; set; }
        public string FileType { get; set; }
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
            ContentType = requestBody.FileType
        };

        var url = _s3Client.GetPreSignedURL(request);

        return Ok(new
        {
            url,
            key = uniqueFileName
        });
    }
}
