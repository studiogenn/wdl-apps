/**
 * Account layout -- hides the site footer and makes the content
 * fill the remaining viewport below the sticky header.
 */

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`footer { display: none !important; }`}</style>
      {children}
    </>
  );
}
