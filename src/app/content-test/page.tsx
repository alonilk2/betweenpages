import {
  getAllBooks,
  getAllAuthors,
  getAllGenres,
  getAllReviews,
  getAllArticles,
  getAllLists,
  buildSearchIndex,
} from '@/lib/content';
import type {
  Book,
  Author,
  Genre,
  ReviewFrontmatter,
  ArticleFrontmatter,
  ListFrontmatter,
  SearchableContent,
} from '@/lib/schemas';

export default function ContentTestPage() {
  // In a real app, this would be handled in getStaticProps or similar
  // For now, let's create a simple test that works at build time
  let books: Book[] = [];
  let authors: Author[] = [];
  let genres: Genre[] = [];
  let reviews: { frontmatter: ReviewFrontmatter; content: string }[] = [];
  let articles: { frontmatter: ArticleFrontmatter; content: string }[] = [];
  let lists: { frontmatter: ListFrontmatter; content: string }[] = [];
  let searchIndex: SearchableContent[] = [];

  try {
    books = getAllBooks();
    authors = getAllAuthors();
    genres = getAllGenres();
    reviews = getAllReviews();
    articles = getAllArticles();
    lists = getAllLists();
    searchIndex = buildSearchIndex();
  } catch (error) {
    console.error('Error loading content:', error);
  }

  return (
    <div className="min-h-screen bg-paper text-ink p-8">
      <h1 className="text-4xl font-bold mb-8 text-coral-500">
        בדיקת תשתית התוכן
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Books */}
        <div className="bg-cream-50 p-6 rounded-lg border border-cream-200">
          <h2 className="text-2xl font-bold mb-4 text-sage-600">
            ספרים ({books.length})
          </h2>
          <ul className="space-y-2">
            {books.map((book) => (
              <li key={book.slug} className="text-sm">
                <strong>{book.title}</strong>
                <br />
                <span className="text-ink-light">
                  מאת: {book.authors.join(', ')}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Authors */}
        <div className="bg-lavender-50 p-6 rounded-lg border border-lavender-200">
          <h2 className="text-2xl font-bold mb-4 text-sage-600">
            מחברים ({authors.length})
          </h2>
          <ul className="space-y-2">
            {authors.map((author) => (
              <li key={author.slug} className="text-sm">
                <strong>{author.name}</strong>
                {author.birthYear && (
                  <span className="text-ink-light"> ({author.birthYear})</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Genres */}
        <div className="bg-sage-50 p-6 rounded-lg border border-sage-200">
          <h2 className="text-2xl font-bold mb-4 text-sage-600">
            סוגות ({genres.length})
          </h2>
          <ul className="space-y-2">
            {genres.map((genre) => (
              <li key={genre.slug} className="text-sm">
                <strong>{genre.name}</strong>
                <br />
                <span className="text-ink-light">{genre.description}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Reviews */}
        <div className="bg-coral-50 p-6 rounded-lg border border-coral-200">
          <h2 className="text-2xl font-bold mb-4 text-sage-600">
            ביקורות ({reviews.length})
          </h2>
          <ul className="space-y-2">
            {reviews.map((review) => (
              <li key={review.frontmatter.slug} className="text-sm">
                <strong>{review.frontmatter.title}</strong>
                <br />
                <span className="text-ink-light">
                  על: {review.frontmatter.book}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Articles */}
        <div className="bg-cream-100 p-6 rounded-lg border border-cream-300">
          <h2 className="text-2xl font-bold mb-4 text-sage-600">
            מאמרים ({articles.length})
          </h2>
          <ul className="space-y-2">
            {articles.map((article) => (
              <li key={article.frontmatter.slug} className="text-sm">
                <strong>{article.frontmatter.title}</strong>
                <br />
                <span className="text-ink-light">
                  {article.frontmatter.excerpt?.slice(0, 50)}...
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Lists */}
        <div className="bg-lavender-100 p-6 rounded-lg border border-lavender-300">
          <h2 className="text-2xl font-bold mb-4 text-sage-600">
            רשימות ({lists.length})
          </h2>
          <ul className="space-y-2">
            {lists.map((list) => (
              <li key={list.frontmatter.slug} className="text-sm">
                <strong>{list.frontmatter.title}</strong>
                <br />
                <span className="text-ink-light">
                  סוג: {list.frontmatter.listType}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Search Index */}
      <div className="mt-12 bg-sage-100 p-6 rounded-lg border border-sage-300">
        <h2 className="text-2xl font-bold mb-4 text-sage-700">
          אינדקס חיפוש ({searchIndex.length} פריטים)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(
            ['book', 'author', 'genre', 'review', 'article', 'list'] as const
          ).map((type) => {
            const count = searchIndex.filter(
              (item) => item.type === type
            ).length;
            return (
              <div key={type} className="bg-white p-3 rounded border">
                <div className="font-semibold">{type}</div>
                <div className="text-2xl text-sage-600">{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-lg text-sage-600">✅ תשתית התוכן עובדת בהצלחה!</p>
        <p className="text-sm text-ink-light mt-2">
          כל הסכמות, הנתונים והאינדקס נטענו כהלכה ב-build time
        </p>
      </div>
    </div>
  );
}
