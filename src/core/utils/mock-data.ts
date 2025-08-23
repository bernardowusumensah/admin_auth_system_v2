import type { AccountDto, UserDto } from '@core/types';
import { SubscriptionStatus, SubscriptionType, SubscriptionPlan, RequiredActionType, Gender } from '@core/types';

// Mock data generator for testing
export class MockDataGenerator {
  private static usernames = [
    'johnwick', 'sarahconnor', 'masterchief', 'princessleia', 'neoanderson',
    'tonystark', 'brucewayne', 'peterparker', 'clarkkent', 'dianprince',
    'barryallen', 'halljordan', 'natasha', 'steverogers', 'thorodinson'
  ];

  private static firstNames = [
    'John', 'Sarah', 'Master', 'Princess', 'Neo',
    'Tony', 'Bruce', 'Peter', 'Clark', 'Diana',
    'Barry', 'Hal', 'Natasha', 'Steve', 'Thor'
  ];

  private static lastNames = [
    'Wick', 'Connor', 'Chief', 'Leia', 'Anderson',
    'Stark', 'Wayne', 'Parker', 'Kent', 'Prince',
    'Allen', 'Jordan', 'Romanoff', 'Rogers', 'Odinson'
  ];

  private static domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'protonmail.com'];

  static generateMockAccounts(count: number = 20): AccountDto[] {
    const accounts: AccountDto[] = [];

    for (let i = 0; i < count; i++) {
      const account = this.generateMockAccount(i);
      accounts.push(account);
    }

    return accounts;
  }

  static generateMockAccount(index: number): AccountDto {
    const username = this.usernames[index % this.usernames.length];
    
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 365));
    
    const hasSubscription = Math.random() > 0.3;
    const isLocked = Math.random() > 0.9;
    const emailConfirmed = Math.random() > 0.2;
    const hasRequiredActions = Math.random() > 0.7;

    const account: AccountDto = {
      id: `account-${index + 1}`,
      username: `${username}${index > 0 ? index : ''}`,
      email: `${username}${index > 0 ? index : ''}@${this.domains[index % this.domains.length]}`,
      emailConfirmation: emailConfirmed,
      userId: `user-${index + 1}`,
      createdOn: createdDate.toISOString(),
      lockedOut: isLocked ? new Date().toISOString() : undefined,
      subscriptions: hasSubscription ? [this.generateMockSubscription()] : [],
      requiredActions: hasRequiredActions ? [this.generateMockRequiredAction(`account-${index + 1}`)] : []
    };

    return account;
  }

  static generateMockUser(index: number): UserDto {
    const firstName = this.firstNames[index % this.firstNames.length];
    const lastName = this.lastNames[index % this.lastNames.length];
    
    const birthDate = new Date();
    birthDate.setFullYear(birthDate.getFullYear() - (20 + Math.floor(Math.random() * 40)));

    return {
      userId: `user-${index + 1}`,
      displayName: `${firstName} ${lastName}`,
      dateOfBirth: birthDate.toISOString(),
      gender: Math.random() > 0.5 ? Gender.Male : Gender.Female,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`,
      address: {
        street: `${Math.floor(Math.random() * 9999)} Main St`,
        city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)],
        state: ['NY', 'CA', 'IL', 'TX', 'AZ'][Math.floor(Math.random() * 5)],
        zipCode: `${Math.floor(Math.random() * 90000) + 10000}`,
        country: 'USA'
      }
    };
  }

  private static generateMockSubscription() {
    const types = [SubscriptionType.Basic, SubscriptionType.Premium];
    const statuses = [SubscriptionStatus.Active, SubscriptionStatus.Expired, SubscriptionStatus.Trial];
    const plans = [SubscriptionPlan.Monthly, SubscriptionPlan.Yearly, SubscriptionPlan.Lifetime];

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 30));
    
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + (Math.random() > 0.5 ? 1 : 12));

    return {
      id: `sub-${Math.random().toString(36).substr(2, 9)}`,
      subscriptionType: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      plan: plans[Math.floor(Math.random() * plans.length)],
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };
  }

  private static generateMockRequiredAction(accountId: string) {
    const actionTypes = [
      RequiredActionType.ConfirmEmail,
      RequiredActionType.EnableMfa,
      RequiredActionType.CompleteUserInformation
    ];

    return {
      accountId,
      requiredActionType: actionTypes[Math.floor(Math.random() * actionTypes.length)]
    };
  }

  // Mock API responses
  static getMockAccountsResponse(page: number = 1, pageSize: number = 10) {
    const allAccounts = this.generateMockAccounts(50);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const accounts = allAccounts.slice(startIndex, endIndex);

    return {
      accounts,
      totalCount: allAccounts.length,
      currentPage: page,
      totalPages: Math.ceil(allAccounts.length / pageSize)
    };
  }

  static getMockAccountDetails(accountId: string) {
    const index = parseInt(accountId.split('-')[1]) - 1;
    const account = this.generateMockAccount(index);
    const user = this.generateMockUser(index);

    return {
      account,
      user
    };
  }
}
