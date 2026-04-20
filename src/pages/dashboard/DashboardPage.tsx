// Dashboard screen: overview widgets and quick navigation for management pages.
export default function DashboardPage() {
  return (
    <section>
      <h1>Dashboard</h1>
      <p>Select Authors, Books, or Reviews from the left menu to manage data.</p>
      <ul>
        <li>Authors: create, update, and delete authors.</li>
        <li>Books: create, update, and delete books with author assignment.</li>
        <li>Reviews: create, update, and delete reviews linked to books.</li>
      </ul>
    </section>
  )
}
