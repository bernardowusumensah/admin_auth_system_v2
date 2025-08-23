import AccountsTable from '@modules/accounts/components/AccountsTable/accounts-table.component';

export default function AccountsScreen() {
  const handleViewAccount = (accountId: string) => {
    // TODO: Implement account details view
    console.log('View account:', accountId);
  };

  return (
    <div>
      <AccountsTable onViewAccount={handleViewAccount} />
    </div>
  );
}
