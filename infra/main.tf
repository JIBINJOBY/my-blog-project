terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.0"
    }
  }
}

provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
  }
}

# 1. Create a Resource Group
resource "azurerm_resource_group" "rg" {
  name     = "${var.resource_prefix}-rg"
  location = var.resource_group_location
}

# 2. Create the Azure Container Registry (ACR) to store Docker images
resource "azurerm_container_registry" "acr" {
  name                = "${var.resource_prefix}acr98756jibin"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Standard" # Use "Standard" for the 12-month free tier
  admin_enabled       = true
}

# 3. Create the Azure Kubernetes Service (AKS) Cluster
resource "azurerm_kubernetes_cluster" "aks" {
  name                = "${var.resource_prefix}-aks"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  dns_prefix          = "${var.resource_prefix}-aks"

  default_node_pool {
    name       = "default"
    node_count = 1
    vm_size    = "Standard_B2s" # Good "Burstable" size, eligible for free tier
  }

  identity {
    type = "SystemAssigned"
  }
}

# 4. Create the Azure PostgreSQL Database (Flexible Server)
resource "azurerm_postgresql_flexible_server" "db" {
  name                = "${var.resource_prefix}-db"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  version = "14"
  
  sku_name = "B_Standard_B1ms" # This SKU is in the 12-month free tier
  
  administrator_login    = "psqladmin"
  administrator_password = "MySuperSecurePassword123!" // CHANGE THIS
  
  storage_mb = 32768 // 32 GB (free tier)
  
  # Allow all Azure services to connect to it (including our AKS cluster)
  public_network_access_enabled = true
}

# 5. Create the database inside the server
resource "azurerm_postgresql_flexible_server_database" "posts_db" {
  name      = "posts_db"
  server_id = azurerm_postgresql_flexible_server.db.id
  charset   = "UTF8"
  collation = "en_US.utf8"
}