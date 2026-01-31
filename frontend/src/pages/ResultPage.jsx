function ResultPage({ resultData }) {
  return (
    <div>
      <h2>Match Result</h2>

      <p>
        <strong>User 1:</strong> {resultData.user1}
      </p>

      <p>
        <strong>User 2:</strong> {resultData.user2}
      </p>

      <p>
        <strong>Match %:</strong> {resultData.similarity}
      </p>

      <h3>Common Channels</h3>
      <ul>
        {resultData.commonChannels.map((ch, index) => (
          <li key={index}>{ch}</li>
        ))}
      </ul>
    </div>
  );
}

export default ResultPage;
