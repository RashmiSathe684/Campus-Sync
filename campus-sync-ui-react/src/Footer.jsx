function Footer() {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900/60 py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-slate-500 text-xs sm:text-sm">
          &copy; {new Date().getFullYear()} Campus Sync. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;