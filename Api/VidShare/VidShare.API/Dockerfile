#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["VidShare.API/VidShare.API.csproj", "VidShare.API/"]
COPY ["VidShare.Data/VidShare.Data.csproj", "VidShare.Data/"]
COPY ["VidShare.Core/VidShare.Core.csproj", "VidShare.Core/"]
COPY ["VidShare.Service/VidShare.Service.csproj", "VidShare.Service/"]
RUN dotnet restore "VidShare.API/VidShare.API.csproj"
COPY . .
WORKDIR "/src/VidShare.API"
RUN dotnet build "VidShare.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "VidShare.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "VidShare.API.dll"]