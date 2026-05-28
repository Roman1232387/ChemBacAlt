FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ChemBacBackend.sln ./
COPY ChemBac.API/ChemBac.API.csproj ChemBac.API/
COPY ChemBac.BusinessLayer/ChemBac.BusinessLayer.csproj ChemBac.BusinessLayer/
COPY ChemBac.DataAccess/ChemBac.DataAccess.csproj ChemBac.DataAccess/
COPY ChemBac.Domain/ChemBac.Domain.csproj ChemBac.Domain/
RUN dotnet restore ChemBac.API/ChemBac.API.csproj

COPY . .
RUN dotnet publish ChemBac.API/ChemBac.API.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "ChemBac.API.dll"]
