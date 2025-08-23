// Account Management Types

export interface AccountDto {
  id?: string;
  username?: string;
  email?: string;
  emailConfirmation?: boolean;
  requiredActions?: RequiredActionDto[];
  subscriptions?: SubscriptionDto[];
  userId?: string;
  lockedOut?: string; // ISO date string
  createdOn?: string; // ISO date string
}

export interface UserDto {
  userId?: string;
  dateOfBirth?: string; // ISO date string
  displayName?: string;
  gender?: Gender;
  avatar?: string;
  address?: AddressDto;
}

export interface AddressDto {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface RequiredActionDto {
  accountId?: string;
  requiredActionType?: RequiredActionType;
}

export interface SubscriptionDto {
  id: string;
  subscriptionType: SubscriptionType;
  status: SubscriptionStatus;
  plan: SubscriptionPlan;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
}

// Request Types
export interface CreateSubscriptionRequest {
  accountId: string;
  subscriptionType: SubscriptionType;
  subscriptionPlan: SubscriptionPlan;
}

export interface CancelSubscriptionRequest {
  subscriptionId: string;
}

// Enums
export enum Gender {
  Male = 0,
  Female = 1,
}

export enum RequiredActionType {
  Skip,
  ConfirmEmail,
  EnableMfa,
  CompleteUserInformation
}

export enum SubscriptionType {
  Basic,
  Premium
}

export enum SubscriptionStatus {
  Pending,
  Active,
  Expired,
  Canceled,
  Trial
}

export enum SubscriptionPlan {
  Monthly,
  Yearly,
  Lifetime
}

// API Response Types
export interface AccountsResponse {
  accounts: AccountDto[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface AccountDetailsResponse {
  account: AccountDto;
  user?: UserDto;
}

// Filter and Search Types
export interface AccountFilters {
  username?: string;
  email?: string;
  emailConfirmation?: boolean;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionType?: SubscriptionType;
  hasRequiredActions?: boolean;
  isLockedOut?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export interface AccountSearchParams {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  filters?: AccountFilters;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
