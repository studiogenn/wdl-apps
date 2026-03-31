/**
 * Editor layout -- minimal shell that hides the site header/footer.
 *
 * The root layout always renders Header, Footer, PostHogProvider, and
 * analytics around every page. This nested layout uses CSS to make the
 * editor take over the full viewport and visually hide the site chrome.
 */

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Hide site header and footer when inside the editor */}
      <style>{`
        header, footer, nav { display: none !important; }
        main { padding: 0 !important; margin: 0 !important; }
      `}</style>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "#fff",
        }}
      >
        {children}
      </div>
    </>
  );
}
