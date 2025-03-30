using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VidShare.Data.Migrations
{
    /// <inheritdoc />
    public partial class updateEF : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_videos_users_UserId",
                table: "videos");

            migrationBuilder.DropForeignKey(
                name: "FK_videos_videos_videoId",
                table: "videos");

            migrationBuilder.DropIndex(
                name: "IX_videos_videoId",
                table: "videos");

            migrationBuilder.DropColumn(
                name: "videoId",
                table: "videos");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "videos",
                newName: "userId");

            migrationBuilder.RenameIndex(
                name: "IX_videos_UserId",
                table: "videos",
                newName: "IX_videos_userId");

            migrationBuilder.AlterColumn<int>(
                name: "userId",
                table: "videos",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_videos_users_userId",
                table: "videos",
                column: "userId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_videos_users_userId",
                table: "videos");

            migrationBuilder.RenameColumn(
                name: "userId",
                table: "videos",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_videos_userId",
                table: "videos",
                newName: "IX_videos_UserId");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "videos",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "videoId",
                table: "videos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_videos_videoId",
                table: "videos",
                column: "videoId");

            migrationBuilder.AddForeignKey(
                name: "FK_videos_users_UserId",
                table: "videos",
                column: "UserId",
                principalTable: "users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_videos_videos_videoId",
                table: "videos",
                column: "videoId",
                principalTable: "videos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
