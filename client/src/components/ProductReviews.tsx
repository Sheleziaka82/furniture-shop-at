import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Star, Upload, ThumbsUp } from 'lucide-react';
import { toast } from 'sonner';

interface Review {
  id: number;
  author: string;
  rating: number;
  title: string;
  text: string;
  verified: boolean;
  helpful: number;
  images?: string[];
  date: string;
}

interface ProductReviewsProps {
  productId: number;
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export function ProductReviews({
  productId,
  reviews,
  averageRating,
  totalReviews,
}: ProductReviewsProps) {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [sortBy, setSortBy] = useState<'helpful' | 'recent' | 'rating'>('helpful');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmitReview = () => {
    if (!title || !text) {
      toast.error('Bitte füllen Sie alle Felder aus');
      return;
    }
    toast.success('Vielen Dank für Ihre Bewertung!');
    setShowForm(false);
    setTitle('');
    setText('');
    setImages([]);
    setRating(5);
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'helpful') return b.helpful - a.helpful;
    if (sortBy === 'rating') return b.rating - a.rating;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="bg-card border border-border rounded-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-5xl font-bold text-primary">{averageRating}</span>
              <div>
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(averageRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{totalReviews} Bewertungen</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = reviews.filter((r) => r.rating === stars).length;
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={stars} className="flex items-center gap-3">
                  <span className="text-sm w-12">{stars} ★</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="mt-8 w-full md:w-auto">
            Bewertung schreiben
          </Button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="bg-card border border-border rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-6">Ihre Bewertung</h3>

          {/* Rating Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3">Bewertung</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Titel</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="z.B. Ausgezeichnete Qualität und Design"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Review Text */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Ihre Bewertung</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Teilen Sie Ihre Erfahrung mit diesem Produkt..."
              rows={5}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Fotos (optional)</label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-muted transition-colors cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="review-images"
              />
              <label htmlFor="review-images" className="cursor-pointer">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-semibold mb-1">Fotos hochladen</p>
                <p className="text-xs text-muted-foreground">
                  Bis zu 5 Bilder (JPG, PNG)
                </p>
              </label>
            </div>
            {images.length > 0 && (
              <p className="text-sm text-green-600 mt-2">
                {images.length} Datei(en) ausgewählt
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <Button onClick={handleSubmitReview}>Bewertung veröffentlichen</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Abbrechen
            </Button>
          </div>
        </div>
      )}

      {/* Sort Options */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Kundenbewertungen</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'helpful' | 'recent' | 'rating')}
          className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="helpful">Hilfreichste</option>
          <option value="recent">Neueste</option>
          <option value="rating">Höchste Bewertung</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {sortedReviews.map((review) => (
          <div key={review.id} className="bg-card border border-border rounded-lg p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-semibold">{review.author}</p>
                  {review.verified && (
                    <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded text-xs font-semibold">
                      ✓ Verifizierter Kauf
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{review.date}</p>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Title and Text */}
            <h4 className="font-semibold mb-2">{review.title}</h4>
            <p className="text-muted-foreground mb-4">{review.text}</p>

            {/* Images */}
            {review.images && review.images.length > 0 && (
              <div className="flex gap-4 mb-4">
                {review.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Review ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}

            {/* Helpful Button */}
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ThumbsUp className="w-4 h-4" />
              Hilfreich ({review.helpful})
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
