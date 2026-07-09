# Database Schema

## Purpose
This document describes a future persistence model for ProgramMetrics. The current static-site preview processes uploads in the browser session. Future app versions may store reports, workflows, brand profiles, and account data with explicit user permission.

## users
Stores user account information.
- id
- email
- name
- role
- created_at
- updated_at

## organizations
Stores customer organizations and team ownership.
- id
- name
- plan
- billing_status
- created_at
- updated_at

## uploads
Stores metadata about uploaded files when persistence is enabled.
- id
- user_id
- organization_id
- original_filename
- file_type
- row_count
- column_count
- storage_uri
- created_at
- expires_at

## reports
Stores generated report records.
- id
- upload_id
- analytics_plan_id
- title
- package_id
- output_level
- status
- created_at
- updated_at

## analytics_plans
Stores generated recommendation engine plans.
- id
- upload_id
- dataset_profile_json
- field_profiles_json
- quality_profile_json
- recommended_visuals_json
- recommended_insights_json
- created_at

## brand_profiles
Stores reusable customer branding.
- id
- organization_id
- name
- logo_uri
- primary_color
- secondary_color
- accent_color
- font_family
- footer_note
- contact_email
- website

## workflows
Stores reusable reporting setup.
- id
- organization_id
- name
- setup_config_json
- package_id
- output_level
- schedule
- created_at
- updated_at

## exports
Stores generated export metadata.
- id
- report_id
- format
- filename
- storage_uri
- locked
- created_at
- expires_at

## payments
Stores payment and checkout state.
- id
- user_id
- organization_id
- provider
- provider_session_id
- package_id
- output_level
- amount
- status
- created_at

## Audit Considerations
Future enterprise versions should add audit logs for upload access, export generation, workflow reruns, and permission changes.
