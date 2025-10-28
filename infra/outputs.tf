output "aks_cluster_name" {
  value = azurerm_kubernetes_cluster.aks.name
}

output "resource_group_name" {
  value = azurerm_resource_group.rg.name
}

output "acr_name" {
  value = azurerm_container_registry.acr.name
}

output "acr_login_server" {
  value = azurerm_container_registry.acr.login_server
}

output "db_connection_string" {
  value     = "postgresql://${azurerm_postgresql_flexible_server.db.administrator_login}:${azurerm_postgresql_flexible_server.db.administrator_password}@${azurerm_postgresql_flexible_server.db.fqdn}/posts_db?sslmode=require"
  sensitive = true
}

output "acr_admin_username" {
  value     = azurerm_container_registry.acr.admin_username
}

output "acr_admin_password" {
  value     = azurerm_container_registry.acr.admin_password
}