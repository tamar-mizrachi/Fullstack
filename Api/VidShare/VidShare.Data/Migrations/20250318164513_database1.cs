using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VidShare.Data.Migrations
{
    /// <inheritdoc />
    public partial class database1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "transcription",
                table: "videos",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "transcription",
                table: "videos");
        }
    }
}
