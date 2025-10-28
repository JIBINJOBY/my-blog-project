variable "resource_group_location" {
  type        = string
  default     = "Central India"
  description = "Location for all resources."
}

variable "resource_prefix" {
  type        = string
  default     = "myblog"
  description = "A unique prefix for all resource names."
}