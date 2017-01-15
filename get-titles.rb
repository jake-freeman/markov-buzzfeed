require 'open-uri'

def extract_titles(html)
  titles = html.scan(/'post\/title'.+\n(.+\n)/)
  titles.each do |title|
    unless title.include? '<' or title.include? '>'
      puts title[0].strip.gsub(/&amp;/, 'and').gsub(/(")|(&quot;)/, '')
    end
  end
end

def main
  sections = ['', 'news', 'videos', 'quizzes', 'food', 'diy', 'animals',
              'audio', 'bigstories', 'books', 'business', 'buzz', 'celebrity',
              'entertainment', 'geeky', 'health', 'lgbt', 'life', 'music',
              'parents', 'podcasts', 'politics', 'puzzles', 'reader',
              'rewind', 'science', 'sports', 'style', 'tech', 'travel',
              'weddings', 'weekend', 'world']

  sections.each do |page|
    uri = "https://www.buzzfeed.com/#{page}"
    page_content = open(uri).read
    extract_titles(page_content)
  end
end

main
