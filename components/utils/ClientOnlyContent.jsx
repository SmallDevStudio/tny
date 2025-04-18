export default function ClientOnlyContent({ html }) {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      className="preview-box [&_table]:border-0 [&_td]:border-0 [&_th]:border-0"
    />
  );
}
