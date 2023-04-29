
import styles from "./bracket.module.css";

const colors = (result, deterministic) => {
  return `bg-${result ? result < 0 ? "red" : "green" : "blue"}-${deterministic ? "400" : "200"} ` +
    `dark:bg-${result ? result < 0 ? "red" : "green" : "blue"}-${deterministic ? "600" : "900"}`;
  // can be bg-red-400 bg-red-200 dark:bg-red-600 dark:bg-red-900
  // can be bg-green-400 bg-green-200 dark:bg-green-600 dark:bg-green-900
  // can be bg-blue-400 bg-blue-200 dark:bg-blue-600 dark:bg-blue-900
};

export const Bracket = ({ format }) => {
  const [brackets, setBrackets] = useState(format.calculateMatchup());
  const renderMatches = (roundMatches) => {
    return roundMatches.map((match, index) => (
      <div key={index} className={`${styles.match} dark:bg-gray-800 rounded-md border-2 dark:border-blue-700 border-blue-500 shadow-md`}>
        <div className={`${styles.matchNumber} p-1 dark:text-white`}>M<br />{match.id}</div>
        <div
          className={`${styles.team} dark:hover:bg-blue-900 hover:bg-blue-100 ${colors(match.picked, match.result)}`}
          onClick={() => {
            format.pickWinner(match, 1);
            setBrackets(format.calculateMatchup());
          }}
        >
          <div className={styles.teamLogo}>
            <img alt={match.team1.code} src={match.team1.icon} className="transfer-team-logo" />
          </div>
          <span className={`${styles.teamName} dark:text-white`}>{match.team1.name}</span>
          <span className={`${styles.scores} dark:${colors(match.result, 1)} ${colors(match.result, 1)}`}>
            {match.score[0].map((x, _idx) => (
              <span className={`${styles.score} ${x > match.score[1][_idx] && "font-bold"}`} key={_idx}>
                {x}
              </span>
            ))}
          </span>
        </div>
        <div
          className={`${styles.team} dark:hover:bg-blue-900 hover:bg-blue-100 ${colors(-match.picked, match.result)}`}
          onClick={() => {
            format.pickWinner(match, -1);
            setBrackets(format.calculateMatchup());
          }}
        >
          <div className={styles.teamLogo}>
            <img alt={match.team2.code} src={match.team2.icon} className="transfer-team-logo" />
          </div>
          <span className={`${styles.teamName} dark:text-white`}>{match.team2.name}</span>
          <span className={`${styles.scores} dark:bg-${colors(-match.result, 1)} bg-${colors(-match.result, 1)}`}>
            {match.score[1].map((x, _idx) => (
              <span className={`${styles.score} ${x > match.score[0][_idx] && "font-bold"}`} key={_idx}>
                {x}
              </span>
            ))}
          </span>
        </div>
      </div>
    ));
  };
  const renderTeams = (bracket) => {
    if (bracket.teams.length === 0) return null;
    return (
      <div key={bracket.pool} className={`${styles.noMatch} dark:bg-gray-800 rounded-md border-2 dark:border-blue-700 border-blue-500 shadow-md`}>
        {bracket.teams.map((team, index) => (
          <div className={styles.teamNomatch} key={index}>
            <span className={`${styles.teamRanking} dark:text-white`}>#{team.ranking}</span>
            <div className={`${styles.team} dark:hover:bg-blue-900 hover:bg-blue-100`}>
              <div className={styles.teamLogo}>
                <img alt={team.code} src={team.icon} className="transfer-team-logo" />
              </div>
              <span className={`${styles.teamName} dark:text-white`}>{team.name}</span>
              <span className={styles.scores}>
                <span className={`${styles.score} dark:text-white`}>{team.buchholtz}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };
  return (
    <div className={styles.bracketWrapper}>
      <div className={`${styles.bracket} dark:bg-gray-900`}>
        <h2 className="text-lg font-semibold dark:text-white mb-4">Winners Bracket</h2>
        <div className={styles.rounds}>
          {brackets.map((round, _idx) => (
            <div key={_idx} className={styles.round}>
              <div className="text-sm font-semibold dark:text-white mb-2">Round {_idx + 1}</div>
              {round.pools.map((bracket, index) => (
                <div key={index} className={styles.bracket}>
                  <div className="text-sm font-semibold dark:text-white mb-2">{bracket.pool}</div>
                  {renderMatches(bracket.matches)}
                  {renderTeams(bracket)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
