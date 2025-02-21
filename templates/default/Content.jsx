
export default function ContentTemplate({ title, content }) {
    return (
        <div>
            <p>Content</p>
            <h1>{title}</h1>
            <p>{content}</p>
        </div>
    );
}
