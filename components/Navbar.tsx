import Link from "next/link";

export function Navbar() {
    return (
      <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #fff'}} className="navbar">
        <Link href="/" className="clean">rasmuskl</Link>
        <div style={{display: 'flex', gap: '1rem'}}>
          <Link href="/feed.xml" className="clean">feed</Link>
          <Link href="/about" className="clean">about</Link>
        </div>
      </div>
    )
};