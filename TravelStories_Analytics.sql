USE TravelStoriesDB;
GO
SELECT DB_NAME() AS CurrentDatabase;


select *
from Stories;
select title,destination,cost
from Stories;

select 
title as storytitle,
cost as travelcost
from Stories;

select distinct  Destination
from Stories;
select *
from stories 
where Destination='goa';

select destination, count(*) StoryCount
from Stories
group by Destination
order by StoryCount ASC ;

use TravelStoriesDB;

select * 
from Stories;
