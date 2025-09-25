export default function TestPage() {
  return (
    <div style={{padding: '20px', color: 'white', backgroundColor: 'black'}}>
      <h1>Test Page Working!</h1>
      <p>If you can see this, Next.js routing is working.</p>
      <p>Current time: {new Date().toISOString()}</p>
    </div>
  )
}