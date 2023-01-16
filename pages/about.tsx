import Head from "next/head";

export default function About() {
    return (
        <>
            <Head>
                <title>About | rasmuskl</title>
            </Head>
            <div>
                <img src="/rkl.jpg" alt="Rasmus" className="right" />
            
                <p>My name is Rasmus Kromann-Larsen and I'm a danish developer blogging about the technical side of my life, mostly .NET stuff, but also fundamental topics like design patterns, principles and productivity boosters.</p>
                <p>I'm currently working as a Principal Software Engineer at Templafy.</p>
                <p>In addition, I am a former core group member of the two largest .NET user groups in Denmark: <a href="http://www.cnug.dk" target="_blank" rel="noreferrer">CNUG</a> and <a href="http://www.anug.dk" target="_blank" rel="noreferrer">ANUG</a>.</p>
            
                <h2>Contact</h2>
                <p>Mail: <a href="mailto:rasmus@kromann-larsen.dk">rasmus@kromann-larsen.dk</a><br />Twitter: <a href="http://twitter.com/rasmuskl" target="_blank" rel="noreferrer">@rasmuskl</a><br />LinkedIn: <a href="http://www.linkedin.com/in/rasmuskl" target="_blank" rel="noreferrer">rasmuskl</a></p>
            </div>
        </>
    );
}