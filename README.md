# Price Of Goods

Testing Change of the README.md file

This website was made so that I can easily see what the price of certain goods are, and compare them to what they were in the past.

People love to talk about the price of X or Y these days and how much it's gone up (usually) in the past N years. Most of these are anecdotal and not based on any real data.
So I wanted to create a website that would allow me to easily see the price of goods over time, and compare them to what they were in the past.

I'm using the [Bureau of Labor Statistics](https://www.bls.gov/) to get the data for the price of goods. They have a lot of data, and it's all free to use.
If you want to look something up yourself, I recommend you go here <https://data.bls.gov/PDQWeb/ap> and look things up yourself. It's a great resource.

## Why are you only tracking certain goods?

Because this is my website, and I can decide what I want to track. I'm tracking goods that I'm interested in, and that I think other people might be interested in as well.
When I launched this website on January 1st 2025, my wife suggested tracking specific things like meats, and produce, so that's on the todo list.

### Roadmap

- [x] Track goods like, eggs, milk, bread, and gas
- [x] Track meats like, beef, chicken, bacon etc #1.
- [x] Track produce like, apples, oranges, bananas etc #2.
- [x] Organize/categorize into sub pages
- [ ] Create a Github issue, or better yet, a PR and help me out!

### Technology Stack

1. Astro [https://astro.build]
2. React 19
3. TailwindCSS
4. Recharts
5. Cloudflare Pages (hosting)
6. Cloudflare Workers (data fetching)
7. Cloudflare R2 (data storing/caching)
6. Github (source control)
7. Zed (code editor)

### How it was built

I protoyped this site in Replit first, to see if it was possible to get the data I needed. To my amazement, Replit built a prototype using something called Streamlit, and Python in minutes.
I was quite amazed with what it built, and I probably could have launched it from their platform, but I wanted to have more control over the code, and I wanted to learn React 19, Vite etc.
Since I work in Javascript/Node world most of the time, I wanted to be able to maintain the website and make enhancements to it in the future. While the $0.25 per checkpoint is a great deal,
I wanted to have more control over where it's hosted and be able to make changes to it myself.

I also think the Replit solution was a bit over engineered for what I needed. I didn't need a backend, or a database, or anything like that. I just needed a way to get the data from the BLS, and display it in a nice way.
So, I took inspiration from the Replit code, and started building this website using React, Vite, and TailwindCSS.

Claude helped me along the way, especially with the rechart stuff and the data fetching.

I started the process of building this website around 6pm on December 31st 2024, and I launched it around 12am on January 1st 2025.

The hurdles I had were related to caching the data and making sure I didn't run out of API credits.
I'm using Cloudflare Workers to fetch the data (<https://github.com/vidluther/pog-cache>) and Cloudflare R2 to store the data. I'm also using Cloudflare Pages to host the website.
The CF Worker pulls the data once a day, creates a JSON file that I can consume in the website, and uploads it to an R2 bucket, which this website consumes. This way I don't have to hit the BLS API every time someone visits the website.

I think I could probably also make the CF worker run once a month, rather than once a day, since the data doesn't change every day.

### Building the Website

For local development, you can use the following command:

```
npm run dev
```

To build the website for production, you can use the following command:

```
npm run build
```
