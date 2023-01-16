export function YouTubeEmbed(props: { id: string }) {
    return (
      <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%' }}>
        <iframe style={{ position: 'absolute', width: '100%', height: '100%'}} src={`//youtube.com/embed/${props.id}`} frameBorder={0} allowFullScreen={true} />
      </div>
    );
  }
  