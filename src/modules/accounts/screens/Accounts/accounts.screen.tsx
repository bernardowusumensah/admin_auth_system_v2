import { useGetAdminAccountsQuery } from '@modules/admin/services/admin-accounts.service';
import AccountsTable from '@modules/accounts/components/AccountsTable/accounts-table.component';

export default function AccountsScreen() {
  const { data, error, isLoading, refetch } = useGetAdminAccountsQuery();

  const handleViewAccount = (accountId: string) => {
    // TODO: Implement account details view
    console.log('View account:', accountId);
  };

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>Error loading accounts</div>}
      <AccountsTable accounts={data || []} onViewAccount={handleViewAccount} />
      <button onClick={() => refetch()}>Refresh</button>
    </div>
  );
}
