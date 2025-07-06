using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VidShare.Data.Migrations
{
    /// <inheritdoc />
    public partial class MigrationTamar : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_videos_categorys_categoryId",
                table: "videos");

            migrationBuilder.DropForeignKey(
                name: "FK_videos_users_userId",
                table: "videos");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "videos");

            migrationBuilder.DropColumn(
                name: "CreatorId",
                table: "videos");

            migrationBuilder.DropColumn(
                name: "transcription",
                table: "videos");

            migrationBuilder.RenameColumn(
                name: "userId",
                table: "videos",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "categoryId",
                table: "videos",
                newName: "CategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_videos_userId",
                table: "videos",
                newName: "IX_videos_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_videos_categoryId",
                table: "videos",
                newName: "IX_videos_CategoryId");

            migrationBuilder.AlterColumn<int>(
                name: "CategoryId",
                table: "videos",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_videos_categorys_CategoryId",
                table: "videos",
                column: "CategoryId",
                principalTable: "categorys",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_videos_users_UserId",
                table: "videos",
                column: "UserId",
                principalTable: "users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_videos_categorys_CategoryId",
                table: "videos");

            migrationBuilder.DropForeignKey(
                name: "FK_videos_users_UserId",
                table: "videos");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "videos",
                newName: "userId");

            migrationBuilder.RenameColumn(
                name: "CategoryId",
                table: "videos",
                newName: "categoryId");

            migrationBuilder.RenameIndex(
                name: "IX_videos_UserId",
                table: "videos",
                newName: "IX_videos_userId");

            migrationBuilder.RenameIndex(
                name: "IX_videos_CategoryId",
                table: "videos",
                newName: "IX_videos_categoryId");

            migrationBuilder.AlterColumn<int>(
                name: "categoryId",
                table: "videos",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "videos",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatorId",
                table: "videos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "transcription",
                table: "videos",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_videos_categorys_categoryId",
                table: "videos",
                column: "categoryId",
                principalTable: "categorys",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_videos_users_userId",
                table: "videos",
                column: "userId",
                principalTable: "users",
                principalColumn: "Id");
        }
    }
}
