import "./CapybaraArticle.css";

function ArticleHeader({ popStackedContent }: { popStackedContent: () => void }) {
  return (
    <header className="article-header">
      <button className="back-button" onClick={popStackedContent} aria-label="Go back">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M19 12H5M5 12L12 19M5 12L12 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </header>
  );
}

export function CapybaraArticle({ popStackedContent, id }: { popStackedContent: () => void; id: string }) {
  return (
    <>
      <ArticleHeader popStackedContent={popStackedContent} />
      <article className="capybara-article">
        <h1>Why Capybaras and Cats Should Be Best Friends #{id}</h1>

        <div className="article-meta">
          <span className="author">By Dr. Fluffy Whiskers</span>
          <span className="date">Published: Today</span>
        </div>

        <div className="article-content">
          <p>
            In a world where unlikely friendships often bring the most joy, there's one pairing that's been overlooked
            for far too long: capybaras and cats. These seemingly different creatures might just be the perfect match we
            never knew we needed.
          </p>

          <h2>The Case for Capybara-Cat Friendship</h2>

          <p>
            Capybaras, the world's largest rodents, are known for their incredibly chill demeanor. They're basically the
            zen masters of the animal kingdom. Meanwhile, cats are... well, cats. But here's why they should be besties:
          </p>

          <ul>
            <li>
              <strong>Complementary Personalities:</strong> Capybaras are famously relaxed and accepting of other
              animals. Cats, with their independent streak, would appreciate a friend who doesn't demand constant
              attention.
            </li>
            <li>
              <strong>Perfect Size Difference:</strong> Capybaras are large enough to be a comfortable resting spot for
              cats, but not so large that they're intimidating. It's like having a built-in cat bed!
            </li>
            <li>
              <strong>Mutual Benefits:</strong> Cats can help keep capybaras clean by grooming their fur, while
              capybaras provide a warm, stable surface for cats to nap on. It's a win-win!
            </li>
          </ul>

          <h2>Real-Life Examples</h2>

          <p>
            While we haven't seen many documented cases of capybara-cat friendships in the wild (probably because they
            live on different continents), we can imagine how perfect it would be. Picture this: a capybara lounging in
            a shallow pool, with a cat perched on its back, both enjoying the sunshine. Pure bliss!
          </p>

          <blockquote>
            "If a capybara can be friends with a crocodile, surely it can be friends with a cat. The possibilities are
            endless!" - Dr. Fluffy Whiskers
          </blockquote>

          <h2>How to Make It Happen</h2>

          <p>While we can't force friendships, we can create the right conditions:</p>

          <ol>
            <li>Introduce them in a neutral space</li>
            <li>Provide plenty of treats for both parties</li>
            <li>Ensure there's enough space for the cat to escape if needed</li>
            <li>Keep the capybara's pool at a comfortable temperature</li>
            <li>Play some relaxing music (capybaras are known to enjoy it)</li>
          </ol>

          <p>
            Remember, the best friendships happen naturally. Whether it's a capybara and a cat, or any other unlikely
            pair, the key is to let them find their own way to each other's hearts.
          </p>

          <div className="article-footer">
            <p className="disclaimer">
              Note: This article is purely fictional and written for entertainment purposes. Please don't try to
              introduce your cat to a capybara without proper supervision and expertise.
            </p>
          </div>
        </div>
      </article>
    </>
  );
}
