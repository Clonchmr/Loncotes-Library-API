﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LoncotesLibrary.Migrations
{
    /// <inheritdoc />
    public partial class FixedCheckouts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Checkouts_MaterialId",
                table: "Checkouts");

            migrationBuilder.CreateIndex(
                name: "IX_Checkouts_MaterialId",
                table: "Checkouts",
                column: "MaterialId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Checkouts_MaterialId",
                table: "Checkouts");

            migrationBuilder.CreateIndex(
                name: "IX_Checkouts_MaterialId",
                table: "Checkouts",
                column: "MaterialId",
                unique: true);
        }
    }
}
