--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2
-- Dumped by pg_dump version 15.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: btree_gin; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS btree_gin WITH SCHEMA public;


--
-- Name: EXTENSION btree_gin; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION btree_gin IS 'support for indexing common datatypes in GIN';


--
-- Name: btree_gist; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS btree_gist WITH SCHEMA public;


--
-- Name: EXTENSION btree_gist; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION btree_gist IS 'support for indexing common datatypes in GiST';


--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


--
-- Name: cube; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS cube WITH SCHEMA public;


--
-- Name: EXTENSION cube; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION cube IS 'data type for multidimensional cubes';


--
-- Name: dblink; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS dblink WITH SCHEMA public;


--
-- Name: EXTENSION dblink; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION dblink IS 'connect to other PostgreSQL databases from within a database';


--
-- Name: dict_int; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS dict_int WITH SCHEMA public;


--
-- Name: EXTENSION dict_int; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION dict_int IS 'text search dictionary template for integers';


--
-- Name: dict_xsyn; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS dict_xsyn WITH SCHEMA public;


--
-- Name: EXTENSION dict_xsyn; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION dict_xsyn IS 'text search dictionary template for extended synonym processing';


--
-- Name: earthdistance; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS earthdistance WITH SCHEMA public;


--
-- Name: EXTENSION earthdistance; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION earthdistance IS 'calculate great-circle distances on the surface of the Earth';


--
-- Name: fuzzystrmatch; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS fuzzystrmatch WITH SCHEMA public;


--
-- Name: EXTENSION fuzzystrmatch; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION fuzzystrmatch IS 'determine similarities and distance between strings';


--
-- Name: hstore; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS hstore WITH SCHEMA public;


--
-- Name: EXTENSION hstore; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION hstore IS 'data type for storing sets of (key, value) pairs';


--
-- Name: intarray; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS intarray WITH SCHEMA public;


--
-- Name: EXTENSION intarray; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION intarray IS 'functions, operators, and index support for 1-D arrays of integers';


--
-- Name: ltree; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS ltree WITH SCHEMA public;


--
-- Name: EXTENSION ltree; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION ltree IS 'data type for hierarchical tree-like structures';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA public;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track execution statistics of all SQL statements executed';


--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: pgrowlocks; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgrowlocks WITH SCHEMA public;


--
-- Name: EXTENSION pgrowlocks; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgrowlocks IS 'show row-level locking information';


--
-- Name: pgstattuple; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgstattuple WITH SCHEMA public;


--
-- Name: EXTENSION pgstattuple; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgstattuple IS 'show tuple-level statistics';


--
-- Name: tablefunc; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS tablefunc WITH SCHEMA public;


--
-- Name: EXTENSION tablefunc; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION tablefunc IS 'functions that manipulate whole tables, including crosstab';


--
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;


--
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: xml2; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS xml2 WITH SCHEMA public;


--
-- Name: EXTENSION xml2; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION xml2 IS 'XPath querying and XSLT';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: answers; Type: TABLE; Schema: public; Owner: apple
--

CREATE TABLE public.answers (
    id integer NOT NULL,
    body text NOT NULL,
    question integer,
    vote integer,
    uid integer,
    date date NOT NULL
);


ALTER TABLE public.answers OWNER TO apple;

--
-- Name: answers_id_seq; Type: SEQUENCE; Schema: public; Owner: apple
--

CREATE SEQUENCE public.answers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.answers_id_seq OWNER TO apple;

--
-- Name: answers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: apple
--

ALTER SEQUENCE public.answers_id_seq OWNED BY public.answers.id;


--
-- Name: booklevel; Type: TABLE; Schema: public; Owner: apple
--

CREATE TABLE public.booklevel (
    id integer NOT NULL,
    book_id integer,
    level_id integer
);


ALTER TABLE public.booklevel OWNER TO apple;

--
-- Name: booklevel_id_seq; Type: SEQUENCE; Schema: public; Owner: apple
--

CREATE SEQUENCE public.booklevel_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.booklevel_id_seq OWNER TO apple;

--
-- Name: booklevel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: apple
--

ALTER SEQUENCE public.booklevel_id_seq OWNED BY public.booklevel.id;


--
-- Name: books; Type: TABLE; Schema: public; Owner: apple
--

CREATE TABLE public.books (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    s_name character varying(255) NOT NULL,
    description text NOT NULL,
    cover character varying(300) NOT NULL,
    author character varying(50),
    is_verified character varying(1),
    upload_date date,
    uid integer,
    verify_token character varying(10)
);


ALTER TABLE public.books OWNER TO apple;

--
-- Name: books_id_seq; Type: SEQUENCE; Schema: public; Owner: apple
--

CREATE SEQUENCE public.books_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.books_id_seq OWNER TO apple;

--
-- Name: books_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: apple
--

ALTER SEQUENCE public.books_id_seq OWNED BY public.books.id;


--
-- Name: follows; Type: TABLE; Schema: public; Owner: apple
--

CREATE TABLE public.follows (
    id integer NOT NULL,
    follower_id integer,
    following_id integer
);


ALTER TABLE public.follows OWNER TO apple;

--
-- Name: follows_id_seq; Type: SEQUENCE; Schema: public; Owner: apple
--

CREATE SEQUENCE public.follows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.follows_id_seq OWNER TO apple;

--
-- Name: follows_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: apple
--

ALTER SEQUENCE public.follows_id_seq OWNED BY public.follows.id;


--
-- Name: levels; Type: TABLE; Schema: public; Owner: apple
--

CREATE TABLE public.levels (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    sl_name character varying(255) NOT NULL,
    is_verified character varying(1)
);


ALTER TABLE public.levels OWNER TO apple;

--
-- Name: levels_id_seq; Type: SEQUENCE; Schema: public; Owner: apple
--

CREATE SEQUENCE public.levels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.levels_id_seq OWNER TO apple;

--
-- Name: levels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: apple
--

ALTER SEQUENCE public.levels_id_seq OWNED BY public.levels.id;


--
-- Name: notes; Type: TABLE; Schema: public; Owner: apple
--

CREATE TABLE public.notes (
    id integer NOT NULL,
    name character varying(500) NOT NULL,
    body text NOT NULL,
    sst_name character varying(500) NOT NULL,
    subtopic integer,
    uid integer,
    date date
);


ALTER TABLE public.notes OWNER TO apple;

--
-- Name: notes_id_seq; Type: SEQUENCE; Schema: public; Owner: apple
--

CREATE SEQUENCE public.notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notes_id_seq OWNER TO apple;

--
-- Name: notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: apple
--

ALTER SEQUENCE public.notes_id_seq OWNED BY public.notes.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: apple
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    content text,
    link text,
    uid integer,
    read character varying(1)
);


ALTER TABLE public.notifications OWNER TO apple;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: apple
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notifications_id_seq OWNER TO apple;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: apple
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: questions; Type: TABLE; Schema: public; Owner: apple
--

CREATE TABLE public.questions (
    id integer NOT NULL,
    title character varying(500) NOT NULL,
    body text,
    sq_name character varying(500) NOT NULL,
    topic integer,
    uid integer,
    date date
);


ALTER TABLE public.questions OWNER TO apple;

--
-- Name: questions_id_seq; Type: SEQUENCE; Schema: public; Owner: apple
--

CREATE SEQUENCE public.questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.questions_id_seq OWNER TO apple;

--
-- Name: questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: apple
--

ALTER SEQUENCE public.questions_id_seq OWNED BY public.questions.id;


--
-- Name: ranks; Type: TABLE; Schema: public; Owner: apple
--

CREATE TABLE public.ranks (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    points character varying(50) NOT NULL
);


ALTER TABLE public.ranks OWNER TO apple;

--
-- Name: ranks_id_seq; Type: SEQUENCE; Schema: public; Owner: apple
--

CREATE SEQUENCE public.ranks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ranks_id_seq OWNER TO apple;

--
-- Name: ranks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: apple
--

ALTER SEQUENCE public.ranks_id_seq OWNED BY public.ranks.id;


--
-- Name: subtopics; Type: TABLE; Schema: public; Owner: apple
--

CREATE TABLE public.subtopics (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    sst_name character varying(255) NOT NULL,
    topic integer
);


ALTER TABLE public.subtopics OWNER TO apple;

--
-- Name: subtopics_id_seq; Type: SEQUENCE; Schema: public; Owner: apple
--

CREATE SEQUENCE public.subtopics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.subtopics_id_seq OWNER TO apple;

--
-- Name: subtopics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: apple
--

ALTER SEQUENCE public.subtopics_id_seq OWNED BY public.subtopics.id;


--
-- Name: topicbook; Type: TABLE; Schema: public; Owner: apple
--

CREATE TABLE public.topicbook (
    id integer NOT NULL,
    topic_id integer,
    book_id integer
);


ALTER TABLE public.topicbook OWNER TO apple;

--
-- Name: topicbook_id_seq; Type: SEQUENCE; Schema: public; Owner: apple
--

CREATE SEQUENCE public.topicbook_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.topicbook_id_seq OWNER TO apple;

--
-- Name: topicbook_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: apple
--

ALTER SEQUENCE public.topicbook_id_seq OWNED BY public.topicbook.id;


--
-- Name: topics; Type: TABLE; Schema: public; Owner: apple
--

CREATE TABLE public.topics (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    st_name character varying(255) NOT NULL
);


ALTER TABLE public.topics OWNER TO apple;

--
-- Name: topics_id_seq; Type: SEQUENCE; Schema: public; Owner: apple
--

CREATE SEQUENCE public.topics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.topics_id_seq OWNER TO apple;

--
-- Name: topics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: apple
--

ALTER SEQUENCE public.topics_id_seq OWNED BY public.topics.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: apple
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    username character varying(40) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    phone character varying(10),
    avatar character varying(1000),
    bio character varying(255),
    tinymce text,
    gpt text,
    points integer,
    balance integer,
    rank integer,
    level integer,
    is_admin character varying(1),
    is_activated character varying(1),
    reset_token character varying(100),
    activate_token character varying(100)
);


ALTER TABLE public.users OWNER TO apple;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: apple
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO apple;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: apple
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: votes; Type: TABLE; Schema: public; Owner: apple
--

CREATE TABLE public.votes (
    id integer NOT NULL,
    answer integer,
    uid integer,
    status character varying(10)
);


ALTER TABLE public.votes OWNER TO apple;

--
-- Name: votes_id_seq; Type: SEQUENCE; Schema: public; Owner: apple
--

CREATE SEQUENCE public.votes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.votes_id_seq OWNER TO apple;

--
-- Name: votes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: apple
--

ALTER SEQUENCE public.votes_id_seq OWNED BY public.votes.id;


--
-- Name: answers id; Type: DEFAULT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.answers ALTER COLUMN id SET DEFAULT nextval('public.answers_id_seq'::regclass);


--
-- Name: booklevel id; Type: DEFAULT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.booklevel ALTER COLUMN id SET DEFAULT nextval('public.booklevel_id_seq'::regclass);


--
-- Name: books id; Type: DEFAULT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.books ALTER COLUMN id SET DEFAULT nextval('public.books_id_seq'::regclass);


--
-- Name: follows id; Type: DEFAULT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.follows ALTER COLUMN id SET DEFAULT nextval('public.follows_id_seq'::regclass);


--
-- Name: levels id; Type: DEFAULT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.levels ALTER COLUMN id SET DEFAULT nextval('public.levels_id_seq'::regclass);


--
-- Name: notes id; Type: DEFAULT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.notes ALTER COLUMN id SET DEFAULT nextval('public.notes_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: questions id; Type: DEFAULT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.questions ALTER COLUMN id SET DEFAULT nextval('public.questions_id_seq'::regclass);


--
-- Name: ranks id; Type: DEFAULT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.ranks ALTER COLUMN id SET DEFAULT nextval('public.ranks_id_seq'::regclass);


--
-- Name: subtopics id; Type: DEFAULT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.subtopics ALTER COLUMN id SET DEFAULT nextval('public.subtopics_id_seq'::regclass);


--
-- Name: topicbook id; Type: DEFAULT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.topicbook ALTER COLUMN id SET DEFAULT nextval('public.topicbook_id_seq'::regclass);


--
-- Name: topics id; Type: DEFAULT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.topics ALTER COLUMN id SET DEFAULT nextval('public.topics_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: votes id; Type: DEFAULT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.votes ALTER COLUMN id SET DEFAULT nextval('public.votes_id_seq'::regclass);


--
-- Data for Name: answers; Type: TABLE DATA; Schema: public; Owner: apple
--

COPY public.answers (id, body, question, vote, uid, date) FROM stdin;
1	<p style="text-align: justify;">The development of computer systems is normally discussed as the development over different generations.&nbsp;With the succession of different generations, came the advancement in computer technology.</p>\n<h2 style="text-align: justify;">Computer Generations</h2>\n<p style="text-align: justify;">Let us now discuss the development in Computer Technology over the different generations.</p>\n<h3 style="text-align: justify;">First Generation</h3>\n<ol class="list" style="text-align: justify;">\n<li>\n<p>The period 1940 to 1956, roughly considered as the First Generation of Computer.</p>\n</li>\n<li>\n<p>The first generation computers were developed by using vacuum tube or thermionic valve machine.</p>\n</li>\n<li>\n<p>The input of this system was based on punched cards and paper tape; however, the output was displayed on printouts.</p>\n</li>\n<li>\n<p>The first generation computers worked on binary-coded concept (i.e., language of 0-1).&nbsp;<strong>Examples:</strong> ENIAC, EDVAC, etc.</p>\n</li>\n</ol>\n<h3 style="text-align: justify;">Second Generation</h3>\n<ol class="list" style="text-align: justify;">\n<li>\n<p>The period 1956 to 1963 is roughly considered as the period of Second Generation of Computers.</p>\n</li>\n<li>\n<p>The second generation computers were developed by using transistor technology.</p>\n</li>\n<li>\n<p>In comparison to the first generation, the size of second generation was smaller.</p>\n</li>\n<li>\n<p>In comparison to computers of the first generation, the computing time taken by the computers of the second generation was lesser.</p>\n</li>\n</ol>\n<h3 style="text-align: justify;">Third Generation</h3>\n<ol class="list" style="text-align: justify;">\n<li>\n<p>The period 1963 to 1971 is roughly considered as the period of Third Generation of computers.</p>\n</li>\n<li>\n<p>The third generation computers were developed by using the Integrated Circuit (IC) technology.</p>\n</li>\n<li>\n<p>In comparison to the computers of the second generation, the size of the computers of the third generation was smaller.</p>\n</li>\n<li>\n<p>In comparison to the computers of the second generation, the computing time taken by the computers of the third generation was lesser.</p>\n</li>\n<li>\n<p>The third generation computer consumed less power and also generated less heat.</p>\n</li>\n<li>\n<p>The maintenance cost of the computers in the third generation was also low.</p>\n</li>\n<li>\n<p>The computer system of the computers of the third generation was easier for commercial use.</p>\n</li>\n</ol>\n<h3 style="text-align: justify;">Fourth Generation</h3>\n<ol class="list" style="text-align: justify;">\n<li>\n<p>The period 1972 to 2010 is roughly considered as the fourth generation of computers.</p>\n</li>\n<li>\n<p>The fourth generation computers were developed by using microprocessor technology.</p>\n</li>\n<li>\n<p>By coming to fourth generation, computer became very small in size, it became portable.</p>\n</li>\n<li>\n<p>The machine of fourth generation started generating very low amount of heat.</p>\n</li>\n<li>\n<p>It is much faster and accuracy became more reliable.</p>\n</li>\n<li>\n<p>The production cost reduced to very low in comparison to the previous generation.</p>\n</li>\n<li>\n<p>It became available for the common people as well.</p>\n</li>\n</ol>\n<h3 style="text-align: justify;">Fifth Generation</h3>\n<ol class="list" style="text-align: justify;">\n<li>\n<p>The period 2010 to till date and beyond, roughly considered as the period of fifth generation of computers.</p>\n</li>\n<li>\n<p>By the time, the computer generation was being categorized on the basis of hardware only, but the fifth generation technology also included software.</p>\n</li>\n<li>\n<p>The computers of the fifth generation had high capability and large memory capacity.</p>\n</li>\n<li>\n<p>Working with computers of this generation was fast and multiple tasks could be performed simultaneously.</p>\n</li>\n<li>\n<p>Some of the popular advanced technologies of the fifth generation include Artificial intelligence, Quantum computation, Nanotechnology, Parallel processing, etc.</p>\n</li>\n</ol>\n<p style="text-align: justify; padding-left: 40px;">&nbsp;</p>\n<p>&nbsp;</p>\n<p>&nbsp;</p>\n<p>&nbsp;</p>	1	0	1	2023-05-16
2	<p><strong>For one-one:</strong></p>\n<pre>Let a, b &isin; R such that f(a) = f(b) then,\nf(a) = f(b) \n&rArr; 2a = 2b \n&rArr; a = b\n<strong>Therefore, f: R ⇢ R is one-one.</strong></pre>\n<p><strong>For onto:</strong></p>\n<pre>Let p be any real number in R (co-domain).\nf(x) = p \n&rArr; 2x = p \n&rArr; x = p/2\np/2 &isin; R for p &isin; R such that f(p/2) = 2(p/2) = p \nFor each p&isin; R (codomain) there exists x = p/2 &isin; R (domain) such that f(x) = y\nFor each element in codomain has its pre-image in domain.\n<strong>So, f: R ⇢ R is onto.</strong>\nSince f: R <strong>⇢ </strong>R is both one-one and onto.\n<strong>f : R </strong>⇢ <strong>R is one-one correspondent (bijective function).</strong></pre>\n<p>&nbsp;</p>	6	1	1	2023-05-21
3	<p>Since the range of f is a subset of the domain of g and the range of g is a subset of the domain of f. So, fog and gof both exist.&nbsp;</p>\n<pre><strong>gof (x)</strong> = g(f(x)) = g(cos x) = (cos x)<sup>3</sup> = cos<sup>3</sup>x\n<strong>fog (x) </strong>= f(g(x)) = f(x<sup>3</sup>) = cos x<sup>3 </sup></pre>\n<p>&nbsp;</p>	7	0	1	2023-05-21
4	<pre>Let f<sup>-1</sup>(16) = x\nf(x) = 16\nx<sup>2</sup> = 16\nx = &plusmn; 4 \nf<sup>-1</sup>(16) = {-4, 4}</pre>\n<p>&nbsp;</p>	8	0	1	2023-05-21
5	<p>Let x &isin; R (domain), y &isin; R (codomain) such that f(a) = b</p>\n<pre>f(x) = y   \n&rArr; 2x + 7 = y\n&rArr; x = (y -7)/2 \n&rArr; f<sup>-1</sup>(y) = (y -7)/2 \n<strong>Thus,  f<sup>-1 : R </sup></strong>⇢ <strong>R is defined as f<sup>-1(x) = (x -7)/2  for all x&isin; R.</sup></strong></pre>\n<p>&nbsp;</p>	9	0	1	2023-05-21
\.


--
-- Data for Name: booklevel; Type: TABLE DATA; Schema: public; Owner: apple
--

COPY public.booklevel (id, book_id, level_id) FROM stdin;
1	1	17
2	2	17
3	3	17
4	4	17
5	5	17
7	7	18
6	6	18
8	8	18
9	9	18
10	10	18
\.


--
-- Data for Name: books; Type: TABLE DATA; Schema: public; Owner: apple
--

COPY public.books (id, name, s_name, description, cover, author, is_verified, upload_date, uid, verify_token) FROM stdin;
1	Introduction to Information Technology	introduction-to-informati	Introduction to Information Technology incorporates the major changes that have taken place in the field of information technology, including not only the latest trends but also future technologies. The coverage of practical and historic perspectives on information technology demonstrates how concepts are applied to real systems and shows their evolution since its beginnings. Written in a clear, concise and lucid manner, each chapter is designed to be covered in two or three lectures while keeping inter-chapter dependencies to a minimum.	https://i.ibb.co/gddLP3M/iit.jpg	Richard Fox	1	2023-05-15	1	AWjHeWN7aK
2	C Programming	c-programming	The authors present the complete guide to ANSI standard C language programming. Written by the developers of C, this new version helps readers keep up with the finalized ANSI standard for C while showing how to take advantage of C's rich set of operators, economy of expression, improved control flow, and data structures. The 2/E has been completely rewritten with additional examples and problem sets to clarify the implementation of difficult language constructs.	https://i.ibb.co/MkJ3XCD/C-Programming.jpg	Darrel L. Graham	1	2023-05-15	1	4LQtMEGkTe
3	Digital Logic	digital-logic	The book presents the basic concepts used in the design and analysis of digital systems and introduces the principles of digital computer organization and design. It provides various methods and techniques suitable for a variety of digital system design applications and covers all aspects of digital systems from the electronic gate circuits to the complex structure of a microcomputer system. It also includes applications of the read only memory (ROM) and programmable logic array (PLA).	https://i.ibb.co/hyvnWyP/digital-Logic.jpg	M. Morris Mano	1	2023-05-15	1	i1jf0HxTVs
4	Mathematics I	mathematics-i	Reading books is a kind of enjoyment. Reading books is a good habit. We bring you a different kinds of books. You can carry this book where ever you want. It is easy to carry. It can be an ideal gift to yourself and to your loved ones. Care instruction keep away from fire.	https://i.ibb.co/c6Np2kN/math-I.jpg	Heritage Publishers	1	2023-05-21	1	YFvuaBCN9C
5	Physics for CSIT	physics-for-csit	This course covers the fundamentals of physics including oscillations, electromagnetic theory, and basics of quantum mechanics, band theory, semiconductors and universal logic gates and finally physics of manufacturing integrated circuits.\nThe main objective of this course is to provide knowledge in physics and apply this knowledge for computer science and information technology.	https://i.ibb.co/C0DQjK3/physics.jpg	Ajay K. Pitamber S. Ghanshyam T. Vijay K.	1	2023-05-21	1	ky11TYflZs
6	Discrete Mathematics and its Application	discrete-mathematics-and-	The course covers fundamental concepts of discrete structure like introduce logic, proofs, sets, relations, functions, counting, and probability, with an emphasis on applications in computer science.\nThe main objective of the course is to introduce basic discrete structures, explore applications of discrete structures in computer science, understand concepts of Counting, Probability, Relations and Graphs respectively.	https://i.ibb.co/JkvKm7g/discrete-math.jpg	Kenneth H. Rosen	1	2023-05-21	1	PdjdjOzKBI
7	Object Oriented Programming	object-oriented-programmi	The course covers the basic concepts of object oriented programming using C++ programming language. The main objective of this course is to understand object oriented programming and advanced C++ concepts such as composition of objects, operator overloads, inheritance and polymorphism, file I/O, exception handling and templates.	https://i.ibb.co/4JgksNM/oop.jpg	E Balagurusamy	1	2023-05-21	1	791LMyY3g4
8	Microprocessor	microprocessor	This course contains of fundamental concepts of computer organization, basic I/O interfaces and Interrupts operations. The course objective is to introduce the operation, programming and application of microprocessor.	https://i.ibb.co/64F5N27/microprocessor.jpg	S. K. Sen	1	2023-05-21	1	D3MgMuTUen
9	Mathematics II	mathematics-ii	The course topics include systems of linear equations, determinants, vectors and vector spaces, eigen values and eigenvectors, and singular value decomposition of a matrix.\nThe main objective of the course is to make familiarize with the concepts and techniques of linear algebra, solve system of linear equation with Gauss-Jordon method, to impart knowledge of vector space and subspace, eigenvalues and eigenvectors of a matrix and get the idea of diagonalization of a matrix, linear programming, Group, Ring, and Field.	https://i.ibb.co/vYCv6dm/math-ii.jpg	Tulsi P. Jhavi L. Laxman B. Pawan S. Subas A.	1	2023-05-21	1	dyFUShc7Mm
10	Statistics I	statistics-i	This course contains the basics of statistics, descriptive statistics, probability, sampling, random variables, mathematical expectations, probability distribution, correlation, and regression.\nThe main objective of this course is to impart knowledge of descriptive statistics, correlation, regression, sampling, theoretical as well as applied knowledge of probability, and some probability distributions.	https://i.ibb.co/C5XTDw9/Statistics-I-CSIT.jpg	Vikash R. Ram P. Bijay L. Nabraj P. Prakash B.	1	2023-05-21	1	qbUdUn12h1
\.


--
-- Data for Name: follows; Type: TABLE DATA; Schema: public; Owner: apple
--

COPY public.follows (id, follower_id, following_id) FROM stdin;
1	3	1
2	3	2
3	2	3
4	2	1
5	1	2
7	1	3
\.


--
-- Data for Name: levels; Type: TABLE DATA; Schema: public; Owner: apple
--

COPY public.levels (id, name, sl_name, is_verified) FROM stdin;
1	Grade 1	grade-1	1
2	Grade 2	grade-2	1
3	Grade 3	grade-3	2
4	Grade 4	grade-4	1
5	Grade 5	grade-5	1
6	Grade 6	grade-6	1
7	Grade 7	grade-7	1
8	Grade 8	grade-8	1
9	Grade 9	grade-9	1
10	Grade 10	grade-10	1
11	Grade 11 - Science	grade-11-science	1
12	Grade 12 - Science	grade-12-science	1
13	Grade 11 - Humanities	grade-11-humanities	1
14	Grade 12 - Humanities	grade-12-humanities	1
15	Grade 11 - Management	grade-11-management	1
16	Grade 12 - Management	grade-12-management	1
17	B.Sc. CSIT 1st Semester	bsc-csit-1	1
18	B.Sc. CSIT 2nd Semester	bsc-csit-2	1
19	B.Sc. CSIT 3rd Semester	bsc-csit-3	1
20	B.Sc. CSIT 4th Semester	bsc-csit-4	1
21	B.Sc. CSIT 5th Semester	bsc-csit-5	1
22	B.Sc. CSIT 6th Semester	bsc-csit-6	1
23	B.Sc. CSIT 7th Semester	bsc-csit-7	1
24	B.Sc. CSIT 8th Semester	bsc-csit-8	1
\.


--
-- Data for Name: notes; Type: TABLE DATA; Schema: public; Owner: apple
--

COPY public.notes (id, name, body, sst_name, subtopic, uid, date) FROM stdin;
1	Introduction	<p>A computer is an electronic device, which accept data and process it and gives us information with set of instructions called program. A computer is a programmable machine, multiuse machine. The word computer is derived from the latin word &ldquo;computare&rdquo;. The computer as a system which is a combination of hardware and software joined together.so it has the ability to:</p>\n<ol>\n<li>Accept data</li>\n<li>input, store and execute instructions.</li>\n<li>perform mathematical and logical operation on data.</li>\n<li>output results.</li>\n</ol>\n<h3>Functions of computer:</h3>\n<p>There are various function of computer. The main functions are of five types. They are as follows:</p>\n<h5>1) Inputting:</h5>\n<p>The process which enter data inside computer system with the help of input devices is called inputting or In others words the process of entering data and instruction is called inputting.</p>\n<h5>2) Processing:</h5>\n<p>The process which performs different mathematical operations and logical operations (&lt;,&le;, &ge;, &ne;, &gt;) is called processing.<br>The computer performs all processing by &ldquo;calculating,&rdquo; and &ldquo;comparing&rdquo; the data stored in its memory (RAM). It is done in two ways. They are as follows:</p>\n<ol>\n<li><strong>Mathematical operation</strong><br>The computer can perform any mathematical operation on data by adding, subtracting, multiplying and dividing(+,-,*,/) one set with another.</li>\n<li><strong>Logical operation</strong><br>The computer can analyze and evaluate data by matching it with sets of known data that are included in the program or called in from storage i.e. it compares two or more data either it is greater than, smaller than, greater or equal to, smaller or equal to and equals to((&lt;, &le;,&nbsp; &ge;,&nbsp; &ne;,&nbsp; &gt;).</li>\n</ol>\n<h5>3. Outputting:</h5>\n<p>The process of giving information or results after processing and storing is called outputting. It is shown by output devices such as monitor. i.e. The process which display result to the user is called outputting.</p>\n<h5>4. Storing</h5>\n<p>The process which helps to store data and information is called storing. The computer is able to store (save) data and programs permanently and retrieve it when required. A system&rsquo;s size is based on how much disk storage it has. The more disks, the more data are immediately available</p>\n<h5>5. Controlling</h5>\n<p>The CPU of a computer is responsible for controlling devices attached with computer. i.e. Controlling is the function of controlling all the input and output devices, application programmes and memory units.</p>\n<h3>Data:</h3>\n<p>The raw facts, measurements, or materials are called data which are collected from different areas to get information. These are also observations, old&nbsp; records. Data is plural form of Datum. For example:</p>\n<div class="table_wrapper">\n<table width="100%">\n<tbody>\n<tr>\n<td>\n<p>A&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 40</p>\n<p>50&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; B</p>\n<p>30</p>\n<p>C&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 80&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; D</p>\n</td>\n</tr>\n</tbody>\n</table>\n</div>\n<p>In above fig.A,50,B,40&hellip;&hellip;. Are data. when you simply look at figure, it does not give any meaning, so data are raw facts.</p>\n<h3>Information:</h3>\n<p>The proceeded data which are in meaningful form are called information. Data are regarded the most fundamental forms of information. Data are arranged&nbsp; and processed to get information.</p>\n<div class="table_wrapper">\n<table>\n<tbody>\n<tr>\n<td width="312">Section</td>\n<td width="312">No of Students</td>\n</tr>\n<tr>\n<td width="312">A\n<p>&nbsp;</p>\n<p>B</p>\n<p>C</p>\n<p>D</p>\n</td>\n<td width="312">50\n<p>&nbsp;</p>\n<p>40</p>\n<p>80</p>\n<p>30</p>\n</td>\n</tr>\n</tbody>\n</table>\n</div>\n<p>When the data of fig 1 are arranged as in fig 2 it gives information since it shows that in section A, there are 50 students and in section B ,there are 40 students and so on.</p>\n<h3>Hardware:</h3>\n<p>The physical components which can be seen, touched, feel are called hardware which are resources of a computer .The hardware consist of following components.</p>\n<h3>Input Device:</h3>\n<p>These devices are used to input data and instruction into computer .eg:&nbsp; keyboard, mouse etc.</p>\n<h3>Memories:</h3>\n<p>These devices are used to store the data and instructions temporarily or permanently.</p>\n<h3>CPU(central processing unit):</h3>\n<p>It is a processing device ,which is used to perform different mathematical operations and execute instruction.</p>\n<h3>Output Devices:</h3>\n<p>Those devices are used to display result to the user. Monitor, printer etc.</p>\n<h3>Advantages of computer:</h3>\n<ol>\n<li>The result given by computer100% accurate and it is reliable than other devices and human beings.</li>\n<li>Computer works in fast speed than human beings.</li>\n<li>Computer is versatile machine as it can do many types of jobs once at a time.</li>\n<li>Computer has higher storage space to store data and information.</li>\n</ol>\n<h3>Disadvantages: of computer</h3>\n<ol>\n<li>Computer is expensive and poor people can not afford but day by day it is becoming cheaper.</li>\n<li>It is totally dependent on electricity and if there is no electricity computer cannot do anything and also the electric shock cause danger.</li>\n<li>Although it is reliable, sometimes the failures of devices and programs can produce unreliable result.</li>\n</ol>\n<p>d).People are becoming too much dependent on computers.</p>\n<h4>Instruction:</h4>\n<p>Instructions are the commands which give the way or path to perform different operations inside computer with the help of different devices.</p>\n<h4>Program:</h4>\n<p>Collections of set of instructions are called programs. Which are used to run and perform different operations inside computer. Each collection of program parts called software.</p>\n<p>&nbsp;</p>	introduction	1	1	2023-05-15
2	Characteristics of Computer	<p>All computers have certain common characteristics irrespective their type and size. Computers are not just adding machines; they are capable of doing complex activities and operations. Computers are what they are because of following characteristics.</p>\n<h4>a) Speed:</h4>\n<p>Computers can calculate at very high speeds. As the power of computer increases, the speed also increases. The smallest unit of time in the human experience is realistically the second. We do not think of doing something in less than a second. But a computer performs operations at an incredible speed. It can process information within Pico second. The computers can process data at an extremely fast rate. i.e. in tune of million of instructions per seconds(MIPS). For example A microcomputer can execute a million of instruction per second. We will use the following terms to describe the processing capability of computer</p>\n<p>Millisecond : one thousand of second = 1/1000</p>\n<p>Microsecond : One million of second = 1/1000,000</p>\n<p>Nanosecond : One billionth of a second = 1/100,000,000</p>\n<p>Picoseconds : One trillionth of a second = 1/1000,000,000,000</p>\n<h4>b) Storage:</h4>\n<p>A computer can store large amount of data. i.e the storage capacity of computer is high. The data can be stored and retrieved according to the need of the user. In fact it takes very less time to retrieve desired information from a huge amount of data stored inside a computer memory. So the capability of storing and retrieving huge amount of data in fast and efficient manner is one of the important characteristics of computer.</p>\n<h4>c) Accuracy</h4>\n<p>In addition to being fast, computers are very accurate which means that the accuracy of computer is very high. The accuracy of a computer is consistently high and the degree of a accuracy of a computer depends upon its design. Every calculation is performed with the same accuracy.</p>\n<h4>d) Diligence:</h4>\n<p>A computer can perform repetitive task without being bored, tired and losing concentration. It can continuously work for several hours without human intervention after the data and programs are fed to it. They can handle complicated and complex tasks. Diligence means being constant and earnest in effort and application.</p>\n<h4>e)Versatility:</h4>\n<p>Computers are very versatile machines. They can perform activities ranging from simple calculations to complex operations. They can perform different tasks depending upon different programs fed to them. For each task to be performed there is one program associated with it.</p>\n<h4>f) Word length:</h4>\n<p>A digital computer operate on binary digits-0 and 1&rsquo;s.It can understand information in terms of 0s and 1s.A binary digit is called a bit. A group of 8 bits is called a byte. Thus the number of bits that a computer can process at a time in parallel is called its word length .commonly used word length are 8,16,32 or 64 bits. Word length is the measure of the computing power of a computer .The longer word length ,the more powerful the computer is. When we talk about 32-bit computer, it means that its word length is 32 bits.</p>\n<h4>g) Automation:</h4>\n<p>The automation characteristics of a computer is that it finishes any task automatically. computers can be programmed&nbsp; to perform a series of complex tasks involving multiple programs.</p>\n<h2>Limitations of computer( What computer can not do?)</h2>\n<ol>\n<li><strong>No Intelligent:</strong>&nbsp;Computer are the machine which can not think. They do not show any intelligence of their own. It can not take its own decision.so their I.Q(Intelligence Quotient) is zero.</li>\n<li><strong>No Intuition</strong>: Computer can not draw conclusion with out going through itself. i.e. they do not have intuition. Computer can only do a job, which can be expressed in a finite number of steps. The computer is useless without correct program.</li>\n<li><strong>No Feeling</strong>: Computer has no emotions because they are machine.</li>\n</ol>\n<p>&nbsp;</p>	characteristics-of-comput	2	1	2023-05-16
3	Classification of Computers	<p>Computers are classified according to their application, work, size, capacity,&nbsp; speed, brand&nbsp; which are described as follows:</p>\n<p><img class="aligncenter" style="display: block; margin-left: auto; margin-right: auto;" src="https://i.ibb.co/WpbQjfC/e03a62c32a3f.png" alt="User Loaded Image | CSIT Guide"></p>\n<h3>Classification of computers Based on work:</h3>\n<ol>\n<li>Digital computer</li>\n<li>Analog Computer</li>\n<li>Hybrid Computer</li>\n</ol>\n<h4>1. Digital Computer</h4>\n<p>A computer which uses binary digits 0s and 1s are called digital computer. They convert the data into binary digits (0s and 1s) and all operations are carried out on these digits at extremely fast rate. A digital computer basically knows how to count the digit and add the digits. Digital computers are much faster than analog computers and far more accurate. Digital computers have high storage or memory. They works upon discontinuous data. Digital computers are multipurpose and programmable and hence used for general purpose( can be used in many different application). Example: Digital Clock, personal computer (PC) etc.</p>\n<h4>2. Analog Computer</h4>\n<p>The computer which is&nbsp; used &nbsp;to measure physical magnitudes(such as-voltage , temperature, current and pressure) is called analog computer. Analog computers works with the natural or physical values. i.e. these computers works with continuous data. The accuracy of analog computer is low and there is very low or do not have storage or memory. Analog computer operates by measuring rather than counting. Analog computers are mostly used in scientific and engineering applications .E.g:- speedometer, voltmeter etc.</p>\n<h4>3. Hybrid computers:</h4>\n<p>A hybrid computer is a combination of both analog and digital computers. i. e&nbsp; it can perform the functions of both a digital and analog computer. or example in an intensive care unit of hospital, analog devices measure the patients heart function, temperature, or other vital signs. These measures are then converted into numbers or digits and supplied to a digital component that monitors the patients vital signs. Hybrid computers are used in weather forecasting. E.g-Hybrid&nbsp; watch.</p>\n<h3><u>Difference Between Analog and Digital Computer</u></h3>\n<div class="table_wrapper">\n<table style="border-collapse: collapse; width: 677px; height: 668px; border-width: 1px; border-style: none; margin-left: auto; margin-right: auto;" border="1">\n<tbody>\n<tr>\n<td style="width: 325.047px; border-width: 1px;"><strong>Analog computer</strong></td>\n<td style="width: 323.391px; border-width: 1px; text-align: center;"><strong>Digital computer</strong></td>\n</tr>\n<tr>\n<td style="width: 325.047px; border-width: 1px;">Analog computers works with the natural or physical values.</td>\n<td style="width: 323.391px; border-width: 1px;">Digital computer works with binary digits (0s and 1s).</td>\n</tr>\n<tr>\n<td style="width: 325.047px; border-width: 1px;">These computer works with continuous data</td>\n<td style="width: 323.391px; border-width: 1px;">These computer works with discontinuous data.</td>\n</tr>\n<tr>\n<td style="width: 325.047px; border-width: 1px;">Accuracy of analog computer is low.</td>\n<td style="width: 323.391px; border-width: 1px;">Accuracy of digital computer is high.</td>\n</tr>\n<tr>\n<td style="width: 325.047px; border-width: 1px;">There is very low or do not have storage or memory in analog computer.</td>\n<td style="width: 323.391px; border-width: 1px;">Digital computers have high storage or memory.</td>\n</tr>\n<tr>\n<td style="width: 325.047px; border-width: 1px;">Cost of analog computer is low.</td>\n<td style="width: 323.391px; border-width: 1px;">Digital computer is multipurpose and programmable and hence used for general purpose.</td>\n</tr>\n<tr>\n<td style="width: 325.047px; border-width: 1px;">Analog computers can&rsquo;t be re-programmed or if needed to be re-programmed then whole circuit system and hardware parts are to be replaced with new ones.</td>\n<td style="width: 323.391px; border-width: 1px;">These computers are totally flexible and can be re-programmed.</td>\n</tr>\n<tr>\n<td style="width: 325.047px; border-width: 1px;">The wave of Analog signals are shown below:\n<p>&nbsp;</p>\n<p><img class="aligncenter" src="https://i.ibb.co/Yh579ww/6768f9806b78.png" alt="User Loaded Image | CSIT Guide" width="304" height="154"></p>\n</td>\n<td style="width: 323.391px; border-width: 1px;">The wave of Digital signals are shown below:\n<p>&nbsp;</p>\n<p><img class="aligncenter" src="https://i.ibb.co/hBph0S5/0da95905dbf0.png" alt="User Loaded Image | CSIT Guide" width="298" height="151"></p>\n</td>\n</tr>\n<tr>\n<td style="width: 325.047px; border-width: 1px;">E.g: Thermometer, Barometer etc.</td>\n<td style="width: 323.391px; border-width: 1px;">E.g: PC, Digital camera, digital clock etc.</td>\n</tr>\n</tbody>\n</table>\n</div>\n<p>&nbsp;</p>\n<p>&nbsp;</p>	classification-of-compute	3	1	2023-05-16
4	Classification of Digital Computer based on Size:	<p>Now day&rsquo;s computers are available in different sizes and with different capabilities. on the basis of storage capacity of speed of processing information computers are classified into:</p>\n<h4>1. Micro computers(PC):</h4>\n<p>The smallest general-purpose computers are called micro computers. Which consists of&nbsp; a single small CPU(central processing units),normally called a microprocessor. Now a days microcomputers are being smaller and smaller but more powerful. Micro computers are known as PC(personal computer) or home computers. These computers are used in Business, engineering, schools, Bank, Entertainment&nbsp; etc. for example: IBM PC(International Business machine),IBM XT(Extended Technology), laptop, notebooks, PDA(personal digital assistant) etc.</p>\n<h4><u>2. Minicomputer</u></h4>\n<p>Minicomputers are more powerful, high processing speed and having more storage capacity than micro computer. The cost of minicomputer is high than micro computer. These are multi-user( means more than one user can use the computer ) and multiprocessor( Having more than one processor in a single system). They have high processing&rsquo;s speed, capabilities, large storage space than micro computers. E.g: VAX 50,IBM360.</p>\n<h4>3. Mainframe Computers:</h4>\n<p>Main frame computer large machines ,made of several units connected together. Mainframe computers are more powerful, high processing speed and having more storage capacity than minicomputer. Mainframe computers are generally used in big organizations and government departments for large-scale data processing. For example: IBM 3090,VAX 8842 etc.</p>\n<h4>4. Super computers</h4>\n<p>The largest computer in the world is called super computer. Which is more powerful ,&nbsp; more expensive computers and they have extremely large storage capacities and processing speed is at least 10 times faster than other computers. so they&nbsp; are big machines. Inside super computers, there are several smaller computers ,each of which can work on different parts of a work simultaneously. They can be handled and maintained by computer engineers only. super computers are used in weather forecasting, medicine and for creating computer graphics. Some of the super computers are CRAY,NEC super SXII,CYBER 205.</p>\n<h4>5. Workstation computer:</h4>\n<p>This is a powerful, single computer. A workstation is like a personal computer, but it has a more powerful microprocessor and a storage device for storing data. These are more expensive computer which are used by Engineers, scientist and other professionals who processed&nbsp; a lot of data. People who use complex program use this types of computers. It has better quality display and others. The powerful workstations are called supermicro. For example: Workstations computer made by Sun, Applo, NeXT, IBM.</p>\n<h4>6. Portable Computers:</h4>\n<p>The computer which can be easily carried from one place to other place around is called portable computer. These are smaller computer and yet powerful. For example: laptops or Notebook PCs, PDA(personal Digital Assistant) etc.</p>\n<h4>7. Network Computers:</h4>\n<p>Network Computers are computers with minimal memory, disk storage and processor power designed to connect to a network, especially the internet. The idea behind network computers is that many users who are connected to a network do not need all the computer power they get from typical personal computer. Instead they can rely on the power of the network servers. These types of computer minimize the amount of disk storage, and processor.</p>	classification-of-digital	4	1	2023-05-21
5	Classification Based on Brand	<p>Computers are classified in terms of brand also. Many companies are involved in manufacturing of computer throughout the world .Many brands of computers are available in the market. On the basis of brand the following three categories are available:</p>\n<ol>\n<li>IBM PC</li>\n<li>IBM compatible</li>\n<li>APPLE/Macintosh</li>\n</ol>\n<h4>1. IBM PC(International Business Machine personal computer)</h4>\n<p>IBM is one the leading companies of the world in manufacturing computers, which established in 1924 in USA.In the beginning IBM&nbsp; manufactured main frame computers followed by mini and micro computers. The computers manufactured by IBM are called as IBM computers or IBM brand computers. personal computer(PC) is the most important type of microcomputer, the microcomputers manufactured by IBM company are called as IBM PC.These computers are more reliable, durable and have better quality and the cost originally was very high but now a days the cost has gone down.</p>\n<h4>2. IBM Compatible</h4>\n<p>A computer that has the same functional characteristic and the principles of IBM computers are called as IBM compatibles. The basic architecture is similar to IBM PC excepting few technologies. All the software and programs, which run in IBM computers can equally run in IBM compatibles. IBM compatible computers are cheaper and their parts are easily available in the market. Therefore they are popular in the world. Most of the microcomputers used in Nepal are IBM compatibles.</p>\n<h4>3. Apple/Macintosh</h4>\n<p>The computer manufactured by Apple company with different architecture is called as Apple or Macintosh computer. This company was established in USA in 1970s.The Apple computers have their own software and hardware. Apple company manufactured new brand of computer popularly known as Macintosh. In Nepal most of the Desktop publishing houses use Apple/Macintosh because they are very easy to handle and the graphic print that we get is of better quality.</p>\n<p>&nbsp;</p>	classification-based-on-b	5	1	2023-05-21
6	Set Theory	<p><strong>Set Theory</strong>&nbsp;is a branch of mathematical logic where we learn sets and their properties. A set is a collection of objects or groups of objects. These objects are often called elements or members of a set. For example, a group of players in a cricket team is a set.&nbsp;</p>\n<p>Since the number of players in a cricket team could be only 11 at a time, thus we can say, this set is a finite set. Another example of a finite set is a set of English vowels. But there are many sets that have infinite members such as a set of natural numbers, a set of whole numbers, set of real numbers, set of imaginary numbers, etc.&nbsp;</p>\n<h2>Set Theory Origin</h2>\n<p>Georg Cantor (1845-1918), a German mathematician, initiated the concept &lsquo;Theory of sets&rsquo; or &lsquo;Set Theory&rsquo;. While working on &ldquo;<em>Problems on Trigonometric Series</em>&rdquo;,&nbsp; he encountered sets, that have become one of the most fundamental concepts in mathematics. Without understanding sets, it will be difficult to explain the other concepts such as relations, functions, sequences, probability, geometry, etc.</p>\n<h2>Definition of Sets</h2>\n<p>As we have already learned in the introduction, set is a well-defined collection of objects or people. Sets can be related to many real-life examples, such as the number of rivers in India, number of colours in a rainbow, etc.&nbsp;</p>\n<h3>Example</h3>\n<p>To understand sets, consider a practical scenario. While going to school from home, Nivy decided to note down the names of restaurants which come in between. The list of the restaurants, in the order they came, was:</p>\n<table cellspacing="0" align="center">\n<tbody>\n<tr>\n<td>\n<table cellspacing="0">\n<tbody>\n<tr>\n<td>List 1: R_A &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; R_B &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; R_C &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; R_D &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; R_E</td>\n</tr>\n</tbody>\n</table>\n</td>\n</tr>\n</tbody>\n</table>\n<p>The above-mentioned list is a collection of objects. Also, it is well-defined. By well-defined, it is meant that anyone should be able to tell whether the object belongs to the particular collection or not. E. g. a stationary shop can&rsquo;t come in the category of the restaurants. If the collection of objects is well-defined, it is known as a set.</p>\n<p>The objects in a set are referred to as elements of the set. A set can have finite or infinite elements. While coming back from the school, Nivy wanted to confirm the list what she had made earlier. This time again, she wrote the list in the order in which restaurants came. The new list was:</p>\n<table cellspacing="0" align="center">\n<tbody>\n<tr>\n<td>\n<table cellspacing="0">\n<tbody>\n<tr>\n<td>List 2: R_E&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;R_D&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; R_C &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; R_B&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; R_A</td>\n</tr>\n</tbody>\n</table>\n</td>\n</tr>\n</tbody>\n</table>\n<p>Now, this is a different list. But is a different set? The answer is no. The order of elements has no significance in sets so it is still the same set.</p>\n<h2>Representation of Sets</h2>\n<p>Sets can be represented in two ways:</p>\n<ol>\n<li>Roster Form or Tabular form</li>\n<li>Set Builder Form</li>\n</ol>\n<h3>Roster Form</h3>\n<p>In roster form, all the elements of the set are listed, separated by commas and enclosed between curly braces { }.&nbsp;</p>\n<p>Example: If set represents all the leap years between the year 1995 and 2015, then it would be described using Roster form as:</p>\n<p>A ={1996,2000,2004,2008,2012}</p>\n<p>Now, the elements inside the braces are written in ascending order. This could be descending order or any random order. As discussed before, the order doesn&rsquo;t matter for a set represented in the Roster Form.&nbsp;</p>\n<p>Also, multiplicity is ignored while representing the sets. E.g. If&nbsp;<strong>L</strong>&nbsp;represents a set that contains all the letters in the word ADDRESS, the proper Roster form representation would be</p>\n<p>L ={A,D,R,E,S }= {S,E,D,A,R}&nbsp;&nbsp;</p>\n<p>L&ne; {A,D,D,R,E,S,S}</p>\n<h3>Set Builder Form</h3>\n<p>In set builder form, all the elements have a common property. This property is not applicable to the objects that do not belong to the set.&nbsp;</p>\n<p>Example: If set&nbsp;<strong>S</strong>&nbsp;has all the elements which are even prime numbers, it is represented as:</p>\n<p>S={ x: x is an even prime number}</p>\n<p>where &lsquo;x&rsquo; is a symbolic representation that is used to describe the element.</p>\n<p>&lsquo;:&rsquo; means &lsquo;such that&rsquo;</p>\n<p>&lsquo;{}&rsquo; means &lsquo;the set of all&rsquo;</p>\n<p>So, S = { x:x is an even prime number } is read as &lsquo;the set of all x such that x is an even prime number&rsquo;. The roster form for this set S would be S = 2. This set contains only one element. Such sets are called singleton/unit sets.</p>\n<p>Another Example:</p>\n<p>F = {p: p is a set of two-digit perfect square numbers}</p>\n<p><strong>How?</strong></p>\n<p>F = {16, 25, 36, 49, 64, 81}</p>\n<p>We can see, in the above example, 16 is a square of 4, 25 is square of 5, 36 is square of 6, 49 is square of 7, 64 is square of 8 and 81 is a square of 9}.&nbsp;</p>\n<p>Even though, 4, 9, 121, etc., are also perfect squares, but they are not elements of the set F, because the it is limited to only two-digit perfect square.</p>\n<h2>Types of Sets</h2>\n<p>The sets are further categorised into different types, based on elements or types of elements. These different types of sets in basic set theory are:</p>\n<ul>\n<li aria-level="1">Finite set: The number of elements is finite</li>\n<li aria-level="1">Infinite set: The number of elements are infinite</li>\n<li aria-level="1">Empty set: It has no elements</li>\n<li aria-level="1">Singleton set: It has one only element</li>\n<li aria-level="1">Equal set: Two sets are equal if they have same elements</li>\n<li aria-level="1">Equivalent set: Two sets are equivalent if they have same number of elements</li>\n<li aria-level="1">Power set: A set of every possible subset.</li>\n<li aria-level="1">Universal set: Any set that contains all the sets under consideration.</li>\n<li aria-level="1">Subset: When all the elements of set A belong to set B, then A is subset of B</li>\n</ul>\n<h2>Set Theory Symbols</h2>\n<p>There are several symbols that are adopted for common sets. They are given in the table below:</p>\n<p>Table 1: Symbols denoting common sets</p>\n<table class="table-bordered" style="border-collapse: collapse; background-color: #ffffff; border: 1px solid #999999;" border="1">\n<tbody>\n<tr>\n<td style="border-color: rgb(153, 153, 153); border-width: 1px;" width="69">Symbol</td>\n<td style="border-color: rgb(153, 153, 153); border-width: 1px;" width="562"><strong>Corresponding Set</strong></td>\n</tr>\n<tr>\n<td style="border-color: rgb(153, 153, 153); border-width: 1px;" width="69">&nbsp;N</td>\n<td style="border-color: rgb(153, 153, 153); border-width: 1px;" width="562">\n<p><strong>Represents the set of all Natural numbers&nbsp;</strong>i.e. all the positive integers.&nbsp;This can also be represented by Z<sup style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">+</sup><span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">.</span></p>\n<p>Examples: 9, 13, 906, 607, etc.</p>\n</td>\n</tr>\n<tr>\n<td style="border-color: rgb(153, 153, 153); border-width: 1px;" width="69">&nbsp;Z</td>\n<td style="border-color: rgb(153, 153, 153); border-width: 1px;" width="562"><strong>Represents the set of all integers </strong>The symbol is derived from the German word&nbsp;<em style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">Zahl</em><span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">, which means number.</span>\n<p>Positive and negative integers are denoted by Z<sup>+</sup>&nbsp;and Z<sup>&ndash;</sup>&nbsp;respectively.</p>\n<p>Examples: -12, 0, 23045, etc.</p>\n</td>\n</tr>\n<tr>\n<td style="border-color: rgb(153, 153, 153); border-width: 1px;" width="69">&nbsp;Q</td>\n<td style="border-color: rgb(153, 153, 153); border-width: 1px;" width="562"><strong>Represents the set of Rational numbers </strong>The symbol is derived from the word&nbsp;<em style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">Quotient</em><span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">. It is defined as the quotient of two integers (with non-zero denominator)</span>\n<p>Positive and negative rational numbers are denoted by Q<sup>+</sup>&nbsp;and Q<sup>&ndash;</sup>&nbsp;respectively.</p>\n<p>Examples: 13/9. -6/7, 14/3, etc.</p>\n</td>\n</tr>\n<tr>\n<td style="border-color: rgb(153, 153, 153); border-width: 1px;" width="69">&nbsp;R</td>\n<td style="border-color: rgb(153, 153, 153); border-width: 1px;" width="562"><strong>Represents the Real numbers</strong> i.e. all the numbers located on the number line. Positive and negative real numbers are denoted by R<sup style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">+</sup><span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">&nbsp;and R</span><sup style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">&ndash;</sup><span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">respectively.</span>\n<p>Examples: 4.3, &pi;, 4&radic; 3, etc.</p>\n</td>\n</tr>\n<tr>\n<td style="border-color: rgb(153, 153, 153); border-width: 1px;" width="69">&nbsp;C</td>\n<td style="border-color: rgb(153, 153, 153); border-width: 1px;" width="562">\n<p><strong>Represents the set of Complex numbers.</strong></p>\n<p>Examples: 4 + 3i, i, etc.</p>\n</td>\n</tr>\n</tbody>\n</table>\n<h3>Other Notations</h3>\n<table class="table-bordered" style="border-collapse: collapse; width: 39.7277%; height: 380.64px; border-width: 1px; background-color: #fff; border-color: #999999; border-style: solid;" border="1">\n<tbody>\n<tr style="height: 22.3906px;">\n<td style="border-color: rgb(153, 153, 153); width: 18.2097%; height: 22.3906px; border-width: 1px;"><strong>Symbol</strong></td>\n<td style="border-color: rgb(153, 153, 153); width: 72.7364%; height: 22.3906px; border-width: 1px;"><strong>Symbol Name</strong></td>\n</tr>\n<tr style="height: 22.3906px;">\n<td style="border-color: rgb(153, 153, 153); width: 18.2097%; height: 22.3906px; border-width: 1px;">{ }</td>\n<td style="border-color: rgb(153, 153, 153); width: 72.7364%; height: 22.3906px; border-width: 1px;">set</td>\n</tr>\n<tr style="height: 22.3906px;">\n<td style="border-color: rgb(153, 153, 153); width: 18.2097%; height: 22.3906px; border-width: 1px;">A &cup; B</td>\n<td style="border-color: rgb(153, 153, 153); width: 72.7364%; height: 22.3906px; border-width: 1px;">A union B</td>\n</tr>\n<tr style="height: 22.3906px;">\n<td style="border-color: rgb(153, 153, 153); width: 18.2097%; height: 22.3906px; border-width: 1px;">A &cap; B</td>\n<td style="border-color: rgb(153, 153, 153); width: 72.7364%; height: 22.3906px; border-width: 1px;">A intersection B</td>\n</tr>\n<tr style="height: 22.3906px;">\n<td style="border-color: rgb(153, 153, 153); width: 18.2097%; height: 22.3906px; border-width: 1px;">A &sube; B</td>\n<td style="border-color: rgb(153, 153, 153); width: 72.7364%; height: 22.3906px; border-width: 1px;">A is subset of B</td>\n</tr>\n<tr style="height: 22.3906px;">\n<td style="border-color: rgb(153, 153, 153); width: 18.2097%; height: 22.3906px; border-width: 1px;">A &nsub; B</td>\n<td style="border-color: rgb(153, 153, 153); width: 72.7364%; height: 22.3906px; border-width: 1px;">A is not subset B</td>\n</tr>\n<tr style="height: 22.3906px;">\n<td style="border-color: rgb(153, 153, 153); width: 18.2097%; height: 22.3906px; border-width: 1px;">A &sub; B</td>\n<td style="border-color: rgb(153, 153, 153); width: 72.7364%; height: 22.3906px; border-width: 1px;">proper subset / strict subset</td>\n</tr>\n<tr style="height: 44.7812px;">\n<td style="border-color: rgb(153, 153, 153); width: 18.2097%; height: 44.7812px; border-width: 1px;">A &sup; B</td>\n<td style="border-color: rgb(153, 153, 153); width: 72.7364%; height: 44.7812px; border-width: 1px;">proper superset / strict superset</td>\n</tr>\n<tr style="height: 22.3906px;">\n<td style="border-color: rgb(153, 153, 153); width: 18.2097%; height: 22.3906px; border-width: 1px;">A &supe; B</td>\n<td style="border-color: rgb(153, 153, 153); width: 72.7364%; height: 22.3906px; border-width: 1px;">superset</td>\n</tr>\n<tr style="height: 22.3906px;">\n<td style="border-color: rgb(153, 153, 153); width: 18.2097%; height: 22.3906px; border-width: 1px;">A ⊅ B</td>\n<td style="border-color: rgb(153, 153, 153); width: 72.7364%; height: 22.3906px; border-width: 1px;">not superset</td>\n</tr>\n<tr style="height: 22.3906px;">\n<td style="border-color: rgb(153, 153, 153); width: 18.2097%; height: 22.3906px; border-width: 1px;">&Oslash;</td>\n<td style="border-color: rgb(153, 153, 153); width: 72.7364%; height: 22.3906px; border-width: 1px;">empty set</td>\n</tr>\n<tr style="height: 22.3906px;">\n<td style="border-color: rgb(153, 153, 153); width: 18.2097%; height: 22.3906px; border-width: 1px;">P (C)</td>\n<td style="border-color: rgb(153, 153, 153); width: 72.7364%; height: 22.3906px; border-width: 1px;">power set</td>\n</tr>\n<tr style="height: 22.3906px;">\n<td style="border-color: rgb(153, 153, 153); width: 18.2097%; height: 22.3906px; border-width: 1px;">A = B</td>\n<td style="border-color: rgb(153, 153, 153); width: 72.7364%; height: 22.3906px; border-width: 1px;">Equal set</td>\n</tr>\n<tr style="height: 22.3906px;">\n<td style="border-color: rgb(153, 153, 153); width: 18.2097%; height: 22.3906px; border-width: 1px;">Ac</td>\n<td style="border-color: rgb(153, 153, 153); width: 72.7364%; height: 22.3906px; border-width: 1px;">Complement of A</td>\n</tr>\n<tr style="height: 22.3906px;">\n<td style="border-color: rgb(153, 153, 153); width: 18.2097%; height: 22.3906px; border-width: 1px;">a&isin;B</td>\n<td style="border-color: rgb(153, 153, 153); width: 72.7364%; height: 22.3906px; border-width: 1px;">a element of B</td>\n</tr>\n<tr style="height: 22.3906px;">\n<td style="border-color: rgb(153, 153, 153); width: 18.2097%; height: 22.3906px; border-width: 1px;">x&notin;A</td>\n<td style="border-color: rgb(153, 153, 153); width: 72.7364%; height: 22.3906px; border-width: 1px;">x not element of A</td>\n</tr>\n</tbody>\n</table>\n<h2>Set Theory Formulas</h2>\n<ul>\n<li aria-level="1">n( A &cup; B ) = n(A) +n(B) &ndash; n (A&nbsp;&cap; B)&nbsp;</li>\n<li aria-level="1">n(A&cup;B)=n(A)+n(B) &nbsp; {when A and B are disjoint sets}</li>\n<li aria-level="1">n(U)=n(A)+n(B)&ndash;n(A&cap;B)+n((A&cup;B)c)</li>\n<li aria-level="1">n(A&cup;B)=n(A&minus;B)+n(B&minus;A)+n(A&cap;B)&nbsp;</li>\n<li aria-level="1">n(A&minus;B)=n(A&cap;B)&minus;n(B)&nbsp;</li>\n<li aria-level="1">n(A&minus;B)=n(A)&minus;n(A&cap;B)&nbsp;</li>\n<li aria-level="1">n(Ac)=n(U)&minus;n(A)</li>\n<li aria-level="1">n(PUQUR)=n(P)+n(Q)+n(R)&ndash;n(P⋂Q)&ndash;n(Q⋂R)&ndash;n(R⋂P)+n(P⋂Q⋂R)&nbsp;</li>\n</ul>\n<h2>Set Operations</h2>\n<p>The four important set operations that are widely used are:</p>\n<ul>\n<li aria-level="1">Union of sets</li>\n<li aria-level="1">Intersection of sets</li>\n<li aria-level="1">Complement of sets</li>\n<li aria-level="1">Difference of sets</li>\n</ul>\n<p><strong>Fundamental Properties of Set operations:</strong></p>\n<p>Like addition and multiplication operation in algebra, the operations such as union and intersection in set theory obeys the properties of associativity and commutativity. Also, the intersection of sets distributes over the union of sets.</p>\n<p>Sets are used to describe one of the most important concepts in mathematics i.e.&nbsp;functions. Everything that you observe around you, is achieved with mathematical models which are formulated, interpreted and solved by functions.</p>\n<h2>Problems and Solutions</h2>\n<p><strong>Q.1: If U = {a, b, c, d, e, f}, A = {a, b, c}, B = {c, d, e, f}, C = {c, d, e}, find (A &cap; B) &cup; (A &cap; C).</strong></p>\n<p>Solution: A &cap; B = {a, b, c} &cap; {c, d, e, f}</p>\n<p>A &cap; B = { c }</p>\n<p>A &cap; C = { a, b, c } &cap; { c, d, e }</p>\n<p>A &cap; C = { c }</p>\n<p>&there4; (A &cap; B) &cup; (A &cap; C) = { c }</p>\n<p><strong>Q.2: Give examples of finite sets.</strong></p>\n<p>Solution: The examples of finite sets are:</p>\n<p>Set of months in a year</p>\n<p>Set of days in a week</p>\n<p>Set of natural numbers less than 20</p>\n<p>Set of integers greater than -2 and less than 3</p>\n<p><strong>Q.3: If U = {2, 3, 4, 5, 6, 7, 8, 9, 10, 11}, A = {3, 5, 7, 9, 11} and B = {7, 8, 9, 10, 11}, Then find (A &ndash; B)&prime;.</strong></p>\n<p>Solution: A &ndash; B is a set of member which belong to A but do not belong to B</p>\n<p>&there4; A &ndash; B = {3, 5, 7, 9, 11} &ndash; {7, 8, 9, 10, 11}</p>\n<p>A &ndash; B = {3, 5}</p>\n<p>According to formula,</p>\n<p>(A &minus; B)&prime; = U &ndash; (A &ndash; B)</p>\n<p>&there4; (A &minus; B)&prime; = {2, 3, 4, 5, 6, 7, 8, 9, 10, 11} &ndash; {3, 5}</p>\n<p>(A &minus; B)&prime; = {2, 4, 6, 7, 8, 9, 10, 11}.</p>\n<p>&nbsp;</p>	set-theory	9	1	2023-05-21
7	Functions in Discrete Mathematics	<p>Functions are an important part of discrete mathematics. This article is all about functions, their types, and other details of functions. A function assigns exactly one element of a set to each element of the other set. Functions are the rules that assign one input to one output. The function can be represented as f: A&nbsp;<strong>⇢</strong>&nbsp;B. A is called the<em>&nbsp;domain of the function</em>&nbsp;and B is called the<em>&nbsp;codomain function</em>.&nbsp;</p>\n<h3>Functions:</h3>\n<ul>\n<li>A function assigns exactly one element of one set to each element of other sets.</li>\n<li>A function is a rule that assigns each input exactly one output.</li>\n<li>A function f from A to B is an assignment of exactly one element of B to each element of A (where &nbsp;A and B are non-empty sets).</li>\n<li>A function f from set A to set B is represented as<strong>&nbsp;f: A ⇢ B&nbsp;</strong>where A is called the domain of f and B is called as codomain of f.</li>\n<li>If b is a unique element of B to element a of A assigned by function F then, it is written as f(a) = b.</li>\n<li>Function f maps A to B means f is a function from A to B i.e. f: A&nbsp;<strong>⇢</strong>&nbsp;B</li>\n</ul>\n<h3>Domain of a function:</h3>\n<ul>\n<li>If f is a function from set A to set B then, A is called the domain of function f.</li>\n<li>The set of all inputs for a function is called its domain.</li>\n</ul>\n<h3>Codomain of a function:</h3>\n<ul>\n<li>If f is a function from set A to set B then, B is called the codomain of function f.</li>\n<li>The set of all allowable outputs for a function is called its codomain.</li>\n</ul>\n<h3>Pre-image and Image of a function:</h3>\n<p>A function f: A&nbsp;<strong>⇢</strong>&nbsp;B such that for each a &isin; A, there exists a unique b &isin; B such that (a, b) &isin; R then, a is called the pre-image of f and b is called the image of f.</p>\n<h3>Types of function:</h3>\n<h3>One-One function ( or Injective Function):</h3>\n<p>A function in which one element of the domain is connected to one element of the codomain.</p>\n<p>A function f: A&nbsp;<strong>⇢</strong> B is said to be a one-one (injective) function if different elements of A have different images in B.</p>\n<p><strong>f: A ⇢ B is one-one&nbsp;</strong></p>\n<p><strong>&rArr;&nbsp; a &ne; b &rArr; &nbsp;f(a) &ne; f(b) &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; for all a, b &isin; &nbsp;A</strong></p>\n<p><strong>&rArr;&nbsp; f(a) = f(b) &rArr; a = b &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; for all a, b &isin; &nbsp;A</strong></p>\n<div class="wp-caption alignnone"><img style="display: block; margin-left: auto; margin-right: auto;" src="https://media.geeksforgeeks.org/wp-content/uploads/20220519204920/oo-300x295.png" sizes="100vw" srcset="https://media.geeksforgeeks.org/wp-content/uploads/20220519204920/oo.png," alt="ONE-ONE FUNCTION" width="300">\n<p class="wp-caption-text"><strong>ONE-ONE FUNCTION</strong></p>\n</div>\n<h3>Many-One function:</h3>\n<p>A function f: A&nbsp;<strong>⇢</strong>&nbsp;B is said to be a many-one function if two or more elements of set A have the same image in B.</p>\n<p>A function f: A&nbsp;<strong>⇢</strong>&nbsp;B is a many-one function if it is not a one-one function.</p>\n<p><strong>f: A ⇢ B is many-one&nbsp;</strong></p>\n<p><strong>&rArr; a &ne; b but f(a) = f(b) &nbsp; &nbsp; &nbsp;for all a, b &isin; &nbsp;A</strong></p>\n<div class="wp-caption alignnone"><img style="display: block; margin-left: auto; margin-right: auto;" src="https://media.geeksforgeeks.org/wp-content/uploads/20220523142424/mof-284x300.png" sizes="100vw" srcset="https://media.geeksforgeeks.org/wp-content/uploads/20220523142424/mof.png," alt="MANY-ONE FUNCTION" width="284">\n<p class="wp-caption-text"><strong>MANY-ONE FUNCTION</strong></p>\n</div>\n<h3>Onto function( or Surjective Function):</h3>\n<p>A function f: A -&gt; B is said to be onto (surjective) function if every element of B is an image of some element of A &nbsp;i.e. f(A) = B or range of f is the codomain of f.</p>\n<p>A function in which every element of the codomain has one pre-image.</p>\n<p>&nbsp;<strong>f: A ⇢ B is onto if for each b&isin; B, there exists a&isin; A such that f(a) = b.</strong></p>\n<div class="wp-caption alignnone"><img style="display: block; margin-left: auto; margin-right: auto;" src="https://media.geeksforgeeks.org/wp-content/uploads/20220519205009/ONTO-300x295.png" sizes="100vw" srcset="https://media.geeksforgeeks.org/wp-content/uploads/20220519205009/ONTO.png," alt="ONTO FUNCTION" width="300">\n<p class="wp-caption-text"><strong>ONTO FUNCTION</strong></p>\n</div>\n<h3>Into Function:</h3>\n<p>A function f: A&nbsp;<strong>⇢</strong>&nbsp;B is said to be an into a function if there exists an element in B with no pre-image in A.</p>\n<p>A function f: A<strong>⇢</strong>&nbsp;B is into function when it is not onto.</p>\n<div class="wp-caption alignnone"><img style="display: block; margin-left: auto; margin-right: auto;" src="https://media.geeksforgeeks.org/wp-content/uploads/20220523142501/INTO-284x300.png" sizes="100vw" srcset="https://media.geeksforgeeks.org/wp-content/uploads/20220523142501/INTO.png," alt="INTO FUNCTION" width="284">\n<p class="wp-caption-text"><strong>INTO FUNCTION</strong></p>\n</div>\n<h3>One-One Correspondent function( or &nbsp;Bijective Function or One-One Onto Function):</h3>\n<p>A function which is both one-one and onto (both injective and surjective) is called one-one correspondent(bijective) function.&nbsp;</p>\n<p><strong>f : A ⇢ B is one-one correspondent (bijective) if:</strong></p>\n<ul>\n<li><strong>one-one i.e. f(a) = f(b) &rArr; a = b &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; for all a, b &isin; &nbsp;A</strong></li>\n<li><strong>onto i.e. &nbsp;for each b &isin; B, there exists a &isin; A such that f(a) = b.</strong></li>\n</ul>\n<div class="wp-caption alignnone"><img style="display: block; margin-left: auto; margin-right: auto;" src="https://media.geeksforgeeks.org/wp-content/uploads/20220524133000/OOO-284x300.png" sizes="100vw" srcset="https://media.geeksforgeeks.org/wp-content/uploads/20220524133000/OOO.png," alt="ONE-ONE CORRESPONDENT FUNCTION" width="284">\n<p class="wp-caption-text"><strong>ONE-ONE CORRESPONDENT FUNCTION</strong></p>\n</div>\n<h3>One-One Into function:</h3>\n<p>A function that is both one-one and into is called one-one into function.</p>\n<div class="wp-caption alignnone"><img style="display: block; margin-left: auto; margin-right: auto;" src="https://media.geeksforgeeks.org/wp-content/uploads/20220524135114/ooi-284x300.png" sizes="100vw" srcset="https://media.geeksforgeeks.org/wp-content/uploads/20220524135114/ooi.png," alt="ONE-ONE INTO FUNCTION" width="284">\n<p class="wp-caption-text"><strong>ONE-ONE INTO FUNCTION</strong></p>\n</div>\n<h3>Many-one onto function:</h3>\n<p>A function that is both many-one and onto is called many-one onto function.</p>\n<div class="wp-caption alignnone"><img style="display: block; margin-left: auto; margin-right: auto;" src="https://media.geeksforgeeks.org/wp-content/uploads/20220524134442/moon-284x300.png" sizes="100vw" srcset="https://media.geeksforgeeks.org/wp-content/uploads/20220524134442/moon.png," alt="MANY-ONE ONTO FUNCTION" width="284">\n<p class="wp-caption-text"><strong>MANY-ONE ONTO FUNCTION</strong></p>\n</div>\n<h3>Many-one into a function:</h3>\n<p>A function that is both many-one and into is called many-one into function.</p>\n<div class="wp-caption alignnone"><img style="display: block; margin-left: auto; margin-right: auto;" src="https://media.geeksforgeeks.org/wp-content/uploads/20220524134449/moin-284x300.png" sizes="100vw" srcset="https://media.geeksforgeeks.org/wp-content/uploads/20220524134449/moin.png," alt="MANY-ONE INTO FUNCTION" width="284">\n<p class="wp-caption-text"><strong>MANY-ONE INTO FUNCTION</strong></p>\n</div>\n<h3>Inverse of a function:</h3>\n<p>Let f: A&nbsp;<strong>⇢</strong>&nbsp;B be a bijection then, a function g: B&nbsp;<strong>⇢&nbsp;</strong>A which associates each element b &isin; B to a different element a &isin; A such that f(a) = b is called the inverse of f.</p>\n<p><strong>f(a) = b &nbsp;&harr;︎ &nbsp;g(b) = a</strong></p>\n<h3>Composition of functions :-</h3>\n<p>Let f: A&nbsp;<strong>⇢</strong>&nbsp;B and g: B&nbsp;<strong>⇢&nbsp;</strong>C be two functions then, a function gof: A&nbsp;<strong>⇢&nbsp;</strong>C is defined by&nbsp;</p>\n<p><strong>(gof)(x) = g(f(x)), for all x &isin; A&nbsp;</strong></p>\n<p>is called the composition of f and g.</p>\n<h3>Note:</h3>\n<p>Let X and Y be two sets with m and n elements and a function is defined as f : X-&gt;Y then,</p>\n<ul>\n<li>Total number of functions = n<sup>m</sup></li>\n<li>Total number of one-one function =<sup>&nbsp;n</sup>P<sub>m</sub></li>\n<li>Total number of onto functions = n<sup>m</sup>&nbsp;&ndash;&nbsp;<sup>n</sup>C<sub>1</sub>(n-1)<sup>m</sup>&nbsp;+&nbsp;<sup>n</sup>C<sub>2</sub>(n-2)<sup>m</sup>&nbsp;&ndash; &hellip;&hellip;&hellip;&hellip;.. + (-1)<sup>n-1n</sup>C<sub>n-1</sub>1<sup>m</sup>&nbsp;&nbsp; &nbsp;if m &ge; n.</li>\n</ul>\n<p>For the composition of functions f and g be two functions :&nbsp;</p>\n<ul>\n<li>fog &ne; gof&nbsp;</li>\n<li>If f and g both are one-one function then fog is also one-one.</li>\n<li>If f and g both are onto function then fog is also onto.</li>\n<li>If f and fog both are one-one function then g is also one-one.</li>\n<li>If f and fog both are onto function then it is not necessary that g is also onto.</li>\n<li>(fog)<sup>-1</sup>&nbsp;= g<sup>-1</sup>o f<sup>-1</sup></li>\n<li>f<sup>-1</sup>o f = f<sup>-1</sup>(f(a)) = f<sup>-1</sup>(b) = a</li>\n<li>fof<sup>-1&nbsp;</sup>= f(f<sup>-1</sup>(b)) = f(a) = b</li>\n</ul>	functions	10	1	2023-05-21
8	Sequences and Summation Notation	<p>A sequence is a function whose domain is the natural numbers. Instead of using the f(x) notation, however, a sequence is listed using the a<sub>n</sub>&nbsp;notation. There are infinite sequences whose domain is the set of all positive integers, and there are finite sequences whose domain is the set of the first n positive integers.</p>\n<p>When you define a sequence, you must write the general term (nth term or a<sub>n</sub>). There are sometimes more than one sequence that is possible if just the first few terms are given.</p>\n<h2>Defining a Sequence</h2>\n<p>There are two common ways to define a sequence by specifying the general term.</p>\n<h3>General Term, a<sub>n</sub></h3>\n<p>The first is to use a form that only depends on the number of the term, n. To find the first five terms when you know the general term, simply substitute the values 1, 2, 3, 4, and 5 into the general form for n and simplify.</p>\n<p>Consider the sequence defined by the general term a<sub>n</sub>&nbsp;= 3n-2</p>\n<p>The first five terms are found by plugging in 1, 2, 3, 4, and 5 for n.</p>\n<ol>\n<li>3(1) - 2 = 1</li>\n<li>3(2) - 2 = 4</li>\n<li>3(3) - 2 = 7</li>\n<li>3(4) - 2 = 10</li>\n<li>3(5) - 2 = 13</li>\n</ol>\n<p>Therefore, the first five terms of the sequence are 1, 4, 7, 10, 13</p>\n<p>Now consider the sequence defined by the general term a<sub>n</sub>&nbsp;= 1 / n.</p>\n<p>The first five terms are 1/1, 1/2, 1/3, 1/4, and 1/5.</p>\n<h3>Recursive Definition</h3>\n<p>The second way is to recursively define a sequence. A recursive definition uses the current and/or previous terms to define the next term. You can think of a<sub>k+1</sub>&nbsp;being the next term, a<sub>k</sub>&nbsp;being the current term, and a<sub>k-1</sub>&nbsp;being the previous term.</p>\n<p>Consider the sequence where a<sub>1</sub>&nbsp;= 5 and a<sub>k+1</sub>&nbsp;= 2 a<sub>k</sub>&nbsp;- 1.</p>\n<p>You can read that last part as "the next term is one less than twice the current term"</p>\n<p>The first five terms are:</p>\n<ol>\n<li>5 (by definition),</li>\n<li>2(5) - 1 = 9 (twice the first term of 5 minus 1),</li>\n<li>2(9) - 1 = 17 (twice the second term of 9 minus 1),</li>\n<li>2(17) - 1 = 33 (twice the third term of 17 minus 1),</li>\n<li>2(33) - 1 = 62 (twice the fourth term of 33 minus 1)</li>\n</ol>\n<p>Now consider the sequence defined by a<sub>1</sub>&nbsp;= 2, a<sub>2</sub>&nbsp;= 1, and a<sub>k+2</sub>&nbsp;= 3a<sub>k</sub>&nbsp;- a<sub>k+1</sub></p>\n<p>You can read that last part as "the next term is 3 times the last term minus the current term"</p>\n<p>The first five terms are:</p>\n<ol>\n<li>2 (by definition),</li>\n<li>1 (by definition),</li>\n<li>3(2) - 1 = 5 (3 times first term minus second term), Note that when k = 1, the sequence gets written as a<sub>1+2</sub>&nbsp;= 3a<sub>1</sub>&nbsp;- a<sub>1+1</sub>&nbsp;which becomes a<sub>3</sub>&nbsp;= 3a<sub>1</sub>&nbsp;- a<sub>2</sub>. Since a<sub>1</sub>&nbsp;= 2 and a<sub>2</sub>&nbsp;= 1, this is where the 3(2) - 1 = 5 comes from.</li>\n<li>3(1) - 5 = -2 (3 times second term minus third term),</li>\n<li>3(5) - (-2) = 17 (3 times third term minus fourth term)</li>\n</ol>\n<h2>Fibonacci Sequence</h2>\n<p>One famous example of a recursively defined sequence is the Fibonacci Sequence. The first two terms of the Fibonacci Sequence are 1 by definition. Every term after that is the sum of the two preceding terms.</p>\n<p>The Fibonacci Sequence is 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ... a<sub>n+1</sub>&nbsp;= a<sub>n</sub>&nbsp;+ a<sub>n-1</sub>.</p>\n<p>Fibonacci sequences occur frequently in nature. For example, take a leaf on a stem of many plants (like cherry, elm, or pear trees). Count the number of leaves until you reach one directly in line with the one you selected. The total number of leaves (not including the first one) is usually a Fibonacci number. If the left and right handed spirals on a pine cone, sunflower seed heads, or pineapples are counted, the two numbers are often consecutive Fibonacci numbers.</p>\n<h2>Factorials - !</h2>\n<p>The symbol for factorial is ! (an explanation point). The factorial of a positive integer is the product of all positive integers less than or equal to that number. Zero factorial is a special case and 0! = 1 by defintion.</p>\n<p>1! = 1<br>2! = 2*1! = 2*1 = 2<br>3! = 3*2! = 3*2*1 = 6<br>4! = 4*3! = 4*3*2*1 = 24<br>5! = 5*4! = 5*4*3*2*1 = 120</p>\n<p>n! = n(n-1)! = n*(n-1)*(n-2)*...3*2*1</p>\n<p>Notice that there is also a recursive definition in there. Any number factorial is that number times the factorial of one less than that number.</p>\n<p>On the TI-82 and TI-83 calculators, the factorial key can be found under Math, Probability, menu choice 4.</p>\n<h3><strong>Simplifying ratios of factorials</strong></h3>\n<p>Consider 8!/5!. One way to work the problem would be to fully expand the 8! and fully expand the 5!.</p>\n<pre>8!   8 * 7 * 6 * 5 * 4 * 3 * 2 * 1\n-- = ----------------------------- = 8 * 7 * 6 = 336\n5!               5 * 4 * 3 * 2 * 1</pre>\n<p>Then you notice that there are common factors of 5, 4, 3, 2, and 1 in both the numerator and denominator that divide out. This leaves you with 8*7*6 in the numerator for an answer of 336.</p>\n<p>Another way to work the problem, however is to use the recursive nature of factorials. Since any number factorial is that number times the factorial of one less than that number, 8! = 8 * 7!, but 7! = 7 * 6!, and 6! = 6 * 5!. This means that 8! = 8 * 7 * 6 * 5!. So, 8! / 5! Is 8*7*6*5!/5! = 8*7*6 = 336.</p>\n<p>The point is that there is no need to multiply the entire thing out when you're just going to be dividing a bunch of it out anyway.</p>\n<p>Here are some steps to simplifying the ratio of two factorials.</p>\n<ol>\n<li>Find the smaller factorial and write it down. It won't change, and it will be the part that is completely divided out.</li>\n<li>Take the larger factorial and start expanding it by subtracting one until the smaller number (that you've already written down) is reached.</li>\n<li>When you reach the smaller number, write it as a factorial and divide out the two equal factorials.</li>\n</ol>\n<p>Here's an example with a little bit more complicated ratio. Since 2n-1 is less than 2n+1, copy the 2n-1 factorial down on the bottom. Now, take 2n+1 times one less than 2n+1. One less then 2n+1 is 2n+1-1=2n. Take that times one less than 2n, which is 2n-1. Since that 2n-1 is the same amount on the bottom, call the 2n-1 factorial and then divide it out, leaving the product of 2n and 2n+1 as the answer.</p>\n<pre>(2n+1)!   (2n+1)*(2n)*(2n-1)!\n------- = ------------------- = 2n(2n+1)\n(2n-1)!               (2n-1)!</pre>\n<h2>Sigma / Summation Notation</h2>\n<p>Summation is something that is done quite often in mathematics, and there is a symbol that means summation. That symbol is the capital Greek letter sigma, and so the notation is sometimes called Sigma Notation instead of Summation Notation.</p>\n<p><img src="https://people.richland.edu/james/lecture/m116/sequences/sum1.gif" alt="sum(a_k,k,1,n) = a_1 + a_2 + a_3 + ... + a_n" width="209" height="52"></p>\n<p>The k is called the index of summation. k=1 is the lower limit of the summation and k=n (although the k is only written once) is the upper limit of the summation.</p>\n<p>What the summation notation means is to evaluate the argument of the summation for every value of the index between the lower limit and upper limit (inclusively) and then add the results together.</p>\n<h3><strong>Examples:</strong></h3>\n<p><img src="https://people.richland.edu/james/lecture/m116/sequences/sum2.gif" alt="sum(3k-2,k,1,5)" width="85" height="52"></p>\n<p>Substitute each value of k between 1 and 5 into the expression 3k-2 and then add the results together.</p>\n<p>[3(1)-2] + [3(2)-2] + [3(3)-2] + [3(4)-2] + [3(5)-2] = 1 + 4 + 7 + 10 + 13 = 35</p>\n<p><img src="https://people.richland.edu/james/lecture/m116/sequences/sum3.gif" alt="sum(3k,k,1,5)-2" width="72" height="52"></p>\n<p>[ 3(1) + 3(2) + 3(3) + 3(4) + 3(5) ] - 2 = [ 3 + 6 + 9 + 12 + 15 ] - 2 = 45 - 2 = 43</p>\n<p>Although these look very similar, the answers are different. The second example is thrown in there to warn you about notation. Multiplication has a higher order of operations than addition or subtraction, so no group symbols are needed around the 3k. But since subtraction has the same precedence as addition, the subtraction of 2 does not go inside the summation. In other words, be sure to include parentheses around a sum or difference if you want the summation to apply to more than just the first term.</p>\n<h2>Properties of Summation</h2>\n<p>The following properties of summation apply no matter what the lower and upper limits are for the index. For simplicity sake, I will not write the k=1 and n, but know that your index of summation is k in the following examples.</p>\n<h3>You can factor a constant out of a sum.</h3>\n<p>&sum;ca<sub>k</sub>&nbsp;= c&sum;a<sub>k</sub></p>\n<p>Notice the a<sub>k</sub>&nbsp;has a subscript of k while the c doesn't. This means that the c is a constant and the a is function of k. The sum of a constant times a function is the constant times the sum of the function.</p>\n<h3>The sum of a sum is the sum of the sums</h3>\n<p>Ooh, that just sounds good. The summation symbol can be distributed over addition.</p>\n<p>&sum;(a<sub>k</sub>&nbsp;+ b<sub>k</sub>) = &sum;a<sub>k</sub>&nbsp;+ &sum;b<sub>k</sub></p>\n<h3>The sum of a difference is the difference of the sums</h3>\n<p>The summation symbol can be distributed over subtraction.</p>\n<p>&sum;(a<sub>k</sub>&nbsp;- b<sub>k</sub>) = &sum;a<sub>k</sub>&nbsp;- &sum;b<sub>k</sub></p>\n<p>Aren't those just beautiful sounding? Those should certainly be placed on a note card to help you remember them.</p>	sequences-and-summation-n	11	1	2023-05-21
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: apple
--

COPY public.notifications (id, content, link, uid, read) FROM stdin;
1	You have contributed a new note [Introduction].	/subtopic/introduction-to-computer/introduction--functions/1/1?nid=1	1	1
2	You have asked a question, [Briefly describe the generations of computer.].	/question/briefly-describe-the-gene/1	1	1
3	You have contributed a new note [Characteristics of Computer].	/subtopic/introduction-to-computer/characteristics-of-comput/2/1?nid=2	1	1
4	You have contributed a new note [Classification of Computers].	/subtopic/introduction-to-computer/classification-of-compute/3/1?nid=3	1	1
5	You have answered your own question [Briefly describe the generations of computer.].	/question/briefly-describe-the-gene/1	1	1
6	You have contributed a new note [Classification Based on Brand].	/subtopic/introduction-to-computer/classification-based-on-b/5/1?nid=5	1	1
7	You have asked a question, [Differentiate between microcomputer and supercomputer.].	/question/differentiate-between-mic/4	1	1
8	You have asked a question, [Write short note:- Workstation computer, personal computer(PC).].	/question/write-short-note-workstat/5	1	1
9	You have contributed a new note [Set Theory].	/subtopic/basic-discrete-structures/sets/9/2?nid=6	1	1
10	You have contributed a new note [Functions].	/subtopic/basic-discrete-structures/functions/10/2?nid=7	1	1
11	You have contributed a new note [Sequences and Summation Notation].	/subtopic/basic-discrete-structures/sequences-and-summations/11/2?nid=8	1	1
12	You have asked a question, [Show that the function f : R ⇢ R, given by f(x) = 2x, is one-one and onto.].	/question/show-that-the-function-f-/6	1	1
13	You have answered your own question [Show that the function f : R ⇢ R, given by f(x) = 2x, is one-one and onto.].	/question/show-that-the-function-f-/6	1	1
14	You have asked a question, [Let  f : R ⇢ R ; f(x) = cos x and  g : R ⇢ R ; g(x) = x3 . Find fog and gof.].	/question/let--f--r--r--fx--cos-x-a/7	1	1
15	You have answered your own question [Let  f : R ⇢ R ; f(x) = cos x and  g : R ⇢ R ; g(x) = x3 . Find fog and gof.].	/question/let--f--r--r--fx--cos-x-a/7	1	1
16	You have asked a question, [If f : Q ⇢ Q is given by f(x) = x2 , then find f-1(16).].	/question/if-f--q--q-is-given-by-fx/8	1	1
17	You have answered your own question [If f : Q ⇢ Q is given by f(x) = x2 , then find f-1(16).].	/question/if-f--q--q-is-given-by-fx/8	1	1
18	You have asked a question, [If f : R ⇢ R; f(x) = 2x + 7  is a bijective function then, find the inverse of f.].	/question/if-f--r--r-fx--2x--7--is-/9	1	1
19	You have answered your own question [If f : R ⇢ R; f(x) = 2x + 7  is a bijective function then, find the inverse of f.].	/question/if-f--r--r-fx--2x--7--is-/9	1	1
20	You have asked a question, [Find the GCD of 24 and 32 using Extended Euclidean algorithm.].	/question/find-the-gcd-of-24-and-32/10	3	1
21	You have asked a question, [Find the value of -2 MOD 3 and 315 MOD 5. Illustrate an example to show the join operation between any two boolean matrixes.].	/question/find-the-value-of-2-mod-3/11	3	1
22	You have asked a question, [Use Chinese Remainder Theorem to find the value of x].	/question/use-chinese-remainder-the/12	3	1
23	You have asked a question, [Prove that the product xy is odd if and only if both x and y are odd integers.].	/question/prove-that-the-product-xy/13	3	1
24	You have asked a question, [Find the value of x such that x = 1 (mod 5) and x = 2 (mod 7) using Chinese remainder theorem.].	/question/find-the-value-of-x-such-/14	3	1
25	You have asked a question, [Prove that “If the product of two integers a and b are even then either a is even or b is even”, using the contradiction method.].	/question/prove-that-if-the-product/15	3	1
26	Manish Timalsina has tipped you Rs. 100.	/user/manishtimilsinaa	1	0
\.


--
-- Data for Name: questions; Type: TABLE DATA; Schema: public; Owner: apple
--

COPY public.questions (id, title, body, sq_name, topic, uid, date) FROM stdin;
1	Briefly describe the generations of computer.		briefly-describe-the-gene	1	1	2023-05-16
4	Differentiate between microcomputer and supercomputer.		differentiate-between-mic	1	1	2023-05-21
5	Write short note:- Workstation computer, personal computer(PC).		write-short-note-workstat	1	1	2023-05-21
6	Show that the function f : R ⇢ R, given by f(x) = 2x, is one-one and onto.		show-that-the-function-f-	2	1	2023-05-21
7	Let  f : R ⇢ R ; f(x) = cos x and  g : R ⇢ R ; g(x) = x3 . Find fog and gof.		let--f--r--r--fx--cos-x-a	2	1	2023-05-21
8	If f : Q ⇢ Q is given by f(x) = x2 , then find f-1(16).		if-f--q--q-is-given-by-fx	2	1	2023-05-21
9	If f : R ⇢ R; f(x) = 2x + 7  is a bijective function then, find the inverse of f.		if-f--r--r-fx--2x--7--is-	2	1	2023-05-21
10	Find the GCD of 24 and 32 using Extended Euclidean algorithm.		find-the-gcd-of-24-and-32	3	3	2023-05-21
12	Use Chinese Remainder Theorem to find the value of x	<p>Such that x = 0 ( MOD 2) , x = 2 (MOD 3) and x = 3 (MOD 5).</p>\n<p>&nbsp;</p>	use-chinese-remainder-the	3	3	2023-05-21
11	Find the value of -2 MOD 3 and 315 MOD 5.	<p>Illustrate an example to show the join operation between any two boolean matrixes.</p>\n<p>&nbsp;</p>	find-the-value-of-2-mod-3	3	3	2023-05-21
13	Prove that the product xy is odd if and only if both x and y are odd integers.		prove-that-the-product-xy	3	3	2023-05-21
14	Find the value of x such that x = 1 (mod 5) and x = 2 (mod 7) using Chinese remainder theorem.		find-the-value-of-x-such-	3	3	2023-05-21
15	Prove that “If the product of two integers a and b are even then either a is even or b is even”, using the contradiction method.		prove-that-if-the-product	5	3	2023-05-21
\.


--
-- Data for Name: ranks; Type: TABLE DATA; Schema: public; Owner: apple
--

COPY public.ranks (id, name, points) FROM stdin;
1	Beginner	0 - 500 XP
2	Apprentice	501 - 1000 XP
3	Journeymen	1001 - 5000 XP
4	Expert	5001 - 10000 XP
5	Master	10001 - 25000 XP
6	Grandmaster	25001 - 50000 XP
7	Legend	50001+ XP
\.


--
-- Data for Name: subtopics; Type: TABLE DATA; Schema: public; Owner: apple
--

COPY public.subtopics (id, name, sst_name, topic) FROM stdin;
1	Introduction & Functions	introduction--functions	1
2	Characteristics of Computer	characteristics-of-comput	1
3	Classification of computers Based on work	classification-of-compute	1
4	Classification of Digital Computer based on Size	classification-of-digital	1
5	Classification Based on Brand	classification-based-on-b	1
6	Types of Computer on the basis of model	types-of-computer-on-the-	1
7	History of computers	history-of-computers	1
8	The Generations of computers	the-generations-of-comput	1
9	Sets	sets	2
10	Functions	functions	2
11	Sequences and Summations	sequences-and-summations	2
12	Integers	integers	3
13	Matrices	matrices	3
14	Logic	logic	4
15	Logic	logic	5
16	Proof Methods	proof-methods	5
17	Induction	induction	6
18	Recursive Definitions and Structural Induction	recursive-definitions-and	6
19	Counting	counting	7
20	Discrete Probability	discrete-probability	7
21	Advanced Counting	advanced-counting	7
22	Relations	relations	8
23	Graphs	graphs	8
24	Trees	trees	8
25	Network Flows	network-flows	8
26	Unit 1	unit-1	9
27	Unit 2	unit-2	9
28	Unit 3	unit-3	9
29	Unit 4	unit-4	9
30	Unit 5	unit-5	9
31	Unit 6	unit-6	9
32	Overview and Problems	overview-and-problems	10
33	Object oriented programming approach	object-oriented-programmi	10
34	Characteristics of OOP	characteristics-of-oop	10
35	Basics & Structure	basics--structure	11
36	Functions	functions	11
37	Pointers	pointers	11
38	Simple Class & Object	simple-class--object	12
39	Constructor	constructor	12
40	Destructor	destructor	12
41	Structures and Classes	structures-and-classes	12
42	Memory allocation	memory-allocation	12
43	Static members	static-members	12
44	Member functions defined outside the class	member-functions-defined-	12
\.


--
-- Data for Name: topicbook; Type: TABLE DATA; Schema: public; Owner: apple
--

COPY public.topicbook (id, topic_id, book_id) FROM stdin;
1	1	1
2	2	6
3	3	6
5	5	6
6	6	6
7	7	6
8	8	6
9	9	6
10	10	7
11	11	7
12	12	7
\.


--
-- Data for Name: topics; Type: TABLE DATA; Schema: public; Owner: apple
--

COPY public.topics (id, name, st_name) FROM stdin;
1	Introduction to Computer	introduction-to-computer
2	Basic Discrete Structures	basic-discrete-structures
3	Integers and Matrices	integers-and-matrices
4	Logic and Proof Methods	logic-and-proof-methods
5	Logic and Proof Methods	logic-and-proof-methods
6	Induction and Recursion	induction-and-recursion
7	Counting and Discrete Probability	counting-and-discrete-pro
8	Relations and Graph	relations-and-graph
9	Laboratory Work	laboratory-work
10	Introduction to OOP	introduction-to-oop
11	Basics of C++ Programming	basics-of-c-programming
12	Classes & Objects	classes--objects
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: apple
--

COPY public.users (id, name, username, email, password, phone, avatar, bio, tinymce, gpt, points, balance, rank, level, is_admin, is_activated, reset_token, activate_token) FROM stdin;
1	Suraj Pulami	surajmgr	surajpulami8@gmail.com	$2b$10$R4eVpiqXTYdLYkMgT.8QU.rlEX.dlGUcDaHNYOTwW6ZZCeDFbDwxG	9804816473	https://i.ibb.co/BKQpC69/pooja.jpg			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	\N	\N	1	12	\N	1	\N	
2	Kripesh Neupane	kripesh88	kripeshneupane10@gmail.com	$2b$10$GYEuYSEM7OZrmWi8C/F/tuSoSsROJOV9tyw9gwNJeqhPLQV0hmbYC		https://i.ibb.co/nDFryzM/kripesh.jpg				\N	\N	1	12	\N	1	\N	
3	Manish Timalsina	manishtimilsinaa	timilsinamanish3@gmail.com	$2b$10$mS8jz80Fh1hlknIw17O5peGkHORppCyZ/oz3FyR3/1p6JYv8c2Naa		https://i.ibb.co/KmqG3zk/manish.jpg				\N	\N	1	12	\N	1	\N	
\.


--
-- Data for Name: votes; Type: TABLE DATA; Schema: public; Owner: apple
--

COPY public.votes (id, answer, uid, status) FROM stdin;
1	2	1	up
\.


--
-- Name: answers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: apple
--

SELECT pg_catalog.setval('public.answers_id_seq', 5, true);


--
-- Name: booklevel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: apple
--

SELECT pg_catalog.setval('public.booklevel_id_seq', 10, true);


--
-- Name: books_id_seq; Type: SEQUENCE SET; Schema: public; Owner: apple
--

SELECT pg_catalog.setval('public.books_id_seq', 10, true);


--
-- Name: follows_id_seq; Type: SEQUENCE SET; Schema: public; Owner: apple
--

SELECT pg_catalog.setval('public.follows_id_seq', 7, true);


--
-- Name: levels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: apple
--

SELECT pg_catalog.setval('public.levels_id_seq', 1, true);


--
-- Name: notes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: apple
--

SELECT pg_catalog.setval('public.notes_id_seq', 8, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: apple
--

SELECT pg_catalog.setval('public.notifications_id_seq', 26, true);


--
-- Name: questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: apple
--

SELECT pg_catalog.setval('public.questions_id_seq', 15, true);


--
-- Name: ranks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: apple
--

SELECT pg_catalog.setval('public.ranks_id_seq', 1, false);


--
-- Name: subtopics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: apple
--

SELECT pg_catalog.setval('public.subtopics_id_seq', 44, true);


--
-- Name: topicbook_id_seq; Type: SEQUENCE SET; Schema: public; Owner: apple
--

SELECT pg_catalog.setval('public.topicbook_id_seq', 12, true);


--
-- Name: topics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: apple
--

SELECT pg_catalog.setval('public.topics_id_seq', 12, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: apple
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: votes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: apple
--

SELECT pg_catalog.setval('public.votes_id_seq', 1, true);


--
-- Name: answers answers_pkey; Type: CONSTRAINT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_pkey PRIMARY KEY (id);


--
-- Name: booklevel booklevel_pkey; Type: CONSTRAINT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.booklevel
    ADD CONSTRAINT booklevel_pkey PRIMARY KEY (id);


--
-- Name: books books_pkey; Type: CONSTRAINT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY (id);


--
-- Name: follows follows_pkey; Type: CONSTRAINT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_pkey PRIMARY KEY (id);


--
-- Name: levels levels_pkey; Type: CONSTRAINT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.levels
    ADD CONSTRAINT levels_pkey PRIMARY KEY (id);


--
-- Name: notes notes_pkey; Type: CONSTRAINT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);


--
-- Name: ranks ranks_pkey; Type: CONSTRAINT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.ranks
    ADD CONSTRAINT ranks_pkey PRIMARY KEY (id);


--
-- Name: subtopics subtopics_pkey; Type: CONSTRAINT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.subtopics
    ADD CONSTRAINT subtopics_pkey PRIMARY KEY (id);


--
-- Name: topicbook topicbook_pkey; Type: CONSTRAINT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.topicbook
    ADD CONSTRAINT topicbook_pkey PRIMARY KEY (id);


--
-- Name: topics topics_pkey; Type: CONSTRAINT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.topics
    ADD CONSTRAINT topics_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: votes votes_pkey; Type: CONSTRAINT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_pkey PRIMARY KEY (id);


--
-- Name: votes fk_answer; Type: FK CONSTRAINT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT fk_answer FOREIGN KEY (answer) REFERENCES public.answers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: booklevel fk_book; Type: FK CONSTRAINT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.booklevel
    ADD CONSTRAINT fk_book FOREIGN KEY (book_id) REFERENCES public.books(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: topicbook fk_book; Type: FK CONSTRAINT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.topicbook
    ADD CONSTRAINT fk_book FOREIGN KEY (book_id) REFERENCES public.books(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: follows fk_follower; Type: FK CONSTRAINT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT fk_follower FOREIGN KEY (follower_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: follows fk_following; Type: FK CONSTRAINT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT fk_following FOREIGN KEY (following_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: users fk_level; Type: FK CONSTRAINT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_level FOREIGN KEY (level) REFERENCES public.levels(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: booklevel fk_level; Type: FK CONSTRAINT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.booklevel
    ADD CONSTRAINT fk_level FOREIGN KEY (level_id) REFERENCES public.levels(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: answers fk_question; Type: FK CONSTRAINT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.answers
    ADD CONSTRAINT fk_question FOREIGN KEY (question) REFERENCES public.questions(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: users fk_rank; Type: FK CONSTRAINT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_rank FOREIGN KEY (rank) REFERENCES public.ranks(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: notes fk_subtopic; Type: FK CONSTRAINT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT fk_subtopic FOREIGN KEY (subtopic) REFERENCES public.subtopics(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: topicbook fk_topic; Type: FK CONSTRAINT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.topicbook
    ADD CONSTRAINT fk_topic FOREIGN KEY (topic_id) REFERENCES public.topics(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: subtopics fk_topic; Type: FK CONSTRAINT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.subtopics
    ADD CONSTRAINT fk_topic FOREIGN KEY (topic) REFERENCES public.topics(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: questions fk_topic; Type: FK CONSTRAINT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT fk_topic FOREIGN KEY (topic) REFERENCES public.topics(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: books fk_user; Type: FK CONSTRAINT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT fk_user FOREIGN KEY (uid) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: notes fk_user; Type: FK CONSTRAINT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT fk_user FOREIGN KEY (uid) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: notifications fk_user; Type: FK CONSTRAINT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_user FOREIGN KEY (uid) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: questions fk_user; Type: FK CONSTRAINT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT fk_user FOREIGN KEY (uid) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: answers fk_user; Type: FK CONSTRAINT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.answers
    ADD CONSTRAINT fk_user FOREIGN KEY (uid) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: votes fk_user; Type: FK CONSTRAINT; Schema: public; Owner: apple
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT fk_user FOREIGN KEY (uid) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

