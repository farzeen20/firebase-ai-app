'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { literacyArticlesData } from '@/lib/data';
import type { LiteracyArticle } from '@/lib/definitions';
import { Bookmark, ThumbsDown, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

function ArticleCard({ article, onToggleBookmark, onFeedback }: { article: LiteracyArticle; onToggleBookmark: (id: string) => void; onFeedback: (id: string, feedback: 'clear' | 'unclear') => void; }) {
  return (
    <Dialog>
      <Card className="flex flex-col overflow-hidden">
        <DialogTrigger asChild>
          <div className="cursor-pointer">
            <CardHeader className="p-0">
              <div className="relative aspect-video">
                <Image src={article.imageUrl} alt={article.title} fill className="object-cover" data-ai-hint={article.imageHint} />
              </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              <Badge variant="secondary" className="mb-2">{article.category}</Badge>
              <CardTitle className="text-lg leading-snug">{article.title}</CardTitle>
            </CardContent>
          </div>
        </DialogTrigger>
        <CardFooter className="p-4 pt-0 mt-auto">
          <Button variant="ghost" size="icon" onClick={() => onToggleBookmark(article.id)}>
            <Bookmark className={cn("h-5 w-5", article.bookmarked && "fill-primary text-primary")} />
          </Button>
        </CardFooter>
      </Card>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{article.title}</DialogTitle>
          <DialogDescription asChild>
            <div>
              <Badge variant="secondary" className="my-2 w-fit">{article.category}</Badge>
              <div className="relative aspect-video my-4 rounded-lg overflow-hidden">
                  <Image src={article.imageUrl} alt={article.title} fill className="object-cover" data-ai-hint={article.imageHint} />
              </div>
              <p>
                  This is the full content of the article. In a real application, this would be fetched from a database or CMS.
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex items-center gap-4">
            <p className="text-sm font-medium">Was this article helpful?</p>
            <Button variant={article.feedback === 'clear' ? 'default' : 'outline'} size="sm" onClick={() => onFeedback(article.id, 'clear')}><ThumbsUp className="mr-2 h-4 w-4" /> Clear</Button>
            <Button variant={article.feedback === 'unclear' ? 'destructive' : 'outline'} size="sm" onClick={() => onFeedback(article.id, 'unclear')}><ThumbsDown className="mr-2 h-4 w-4" /> Unclear</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function LiteracyHub() {
  const [articles, setArticles] = useState<LiteracyArticle[]>(literacyArticlesData);
  const [filter, setFilter] = useState<string>('All');

  const handleToggleBookmark = (id: string) => {
    setArticles(articles.map(a => a.id === id ? { ...a, bookmarked: !a.bookmarked } : a));
  };
  
  const handleFeedback = (id: string, feedback: 'clear' | 'unclear') => {
    setArticles(articles.map(a => a.id === id ? { ...a, feedback } : a));
  };

  const categories = ['All', ...Array.from(new Set(articles.map(a => a.category)))];
  const filteredArticles = filter === 'All' ? articles : articles.filter(a => a.category === filter);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Financial Literacy Hub</h1>
        <p className="text-muted-foreground">Empower yourself with financial knowledge.</p>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {categories.map(category => (
          <Button
            key={category}
            variant={filter === category ? 'default' : 'outline'}
            onClick={() => setFilter(category)}
          >
            {category}
          </Button>
        ))}
         <Button
            variant={filter === 'Bookmarked' ? 'default' : 'outline'}
            onClick={() => setFilter('Bookmarked')}
            className="text-primary border-primary hover:bg-primary/10 hover:text-primary"
          >
            <Bookmark className="mr-2 h-4 w-4" />
            Bookmarked
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {(filter === 'Bookmarked' ? articles.filter(a => a.bookmarked) : filteredArticles).map(article => (
          <ArticleCard key={article.id} article={article} onToggleBookmark={handleToggleBookmark} onFeedback={handleFeedback} />
        ))}
      </div>
    </div>
  );
}
