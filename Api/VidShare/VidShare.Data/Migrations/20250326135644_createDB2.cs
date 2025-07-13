using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VidShare.Data.Migrations
{
    /// <inheritdoc />
    public partial class createDB2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "videos",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "categoryId",
                table: "videos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "videoId",
                table: "videos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "businessDetailes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    City = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_businessDetailes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "categorys",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_categorys", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_videos_categoryId",
                table: "videos",
                column: "categoryId");

            migrationBuilder.CreateIndex(
                name: "IX_videos_videoId",
                table: "videos",
                column: "videoId");

            migrationBuilder.AddForeignKey(
                name: "FK_videos_categorys_categoryId",
                table: "videos",
                column: "categoryId",
                principalTable: "categorys",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);

            migrationBuilder.AddForeignKey(
                name: "FK_videos_videos_videoId",
                table: "videos",
                column: "videoId",
                principalTable: "videos",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_videos_categorys_categoryId",
                table: "videos");

            migrationBuilder.DropForeignKey(
                name: "FK_videos_videos_videoId",
                table: "videos");

            migrationBuilder.DropTable(
                name: "businessDetailes");

            migrationBuilder.DropTable(
                name: "categorys");

            migrationBuilder.DropIndex(
                name: "IX_videos_categoryId",
                table: "videos");

            migrationBuilder.DropIndex(
                name: "IX_videos_videoId",
                table: "videos");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "videos");

            migrationBuilder.DropColumn(
                name: "categoryId",
                table: "videos");

            migrationBuilder.DropColumn(
                name: "videoId",
                table: "videos");
        }
    }
}
