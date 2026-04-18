--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2026-04-12 09:41:00

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 25733)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 4998 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 227 (class 1259 OID 25681)
-- Name: cursos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cursos (
    id_curso integer NOT NULL,
    nombre character varying(45) NOT NULL,
    descripcion text NOT NULL,
    fecha_inicio date NOT NULL,
    cantidad_horas integer NOT NULL,
    inscriptos_max smallint NOT NULL,
    id_curso_estado smallint NOT NULL,
    id_usuario_modificacion integer NOT NULL,
    fecha_hora_modificacion timestamp without time zone NOT NULL
);


ALTER TABLE public.cursos OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 25655)
-- Name: cursos_estados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cursos_estados (
    id_curso_estado smallint NOT NULL,
    descripcion character varying(45) NOT NULL,
    es_activo smallint NOT NULL
);


ALTER TABLE public.cursos_estados OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 25654)
-- Name: cursos_estados_id_curso_estado_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cursos_estados_id_curso_estado_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cursos_estados_id_curso_estado_seq OWNER TO postgres;

--
-- TOC entry 4999 (class 0 OID 0)
-- Dependencies: 220
-- Name: cursos_estados_id_curso_estado_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cursos_estados_id_curso_estado_seq OWNED BY public.cursos_estados.id_curso_estado;


--
-- TOC entry 226 (class 1259 OID 25680)
-- Name: cursos_id_curso_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cursos_id_curso_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cursos_id_curso_seq OWNER TO postgres;

--
-- TOC entry 5000 (class 0 OID 0)
-- Dependencies: 226
-- Name: cursos_id_curso_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cursos_id_curso_seq OWNED BY public.cursos.id_curso;


--
-- TOC entry 225 (class 1259 OID 25669)
-- Name: estudiantes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estudiantes (
    id_estudiante integer NOT NULL,
    documento character varying(20) NOT NULL,
    apellido character varying(100) NOT NULL,
    nombres character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    fecha_nacimiento date NOT NULL,
    activo smallint NOT NULL,
    id_usuario_modificacion integer NOT NULL,
    fecha_hora_modificacion timestamp without time zone NOT NULL
);


ALTER TABLE public.estudiantes OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 25668)
-- Name: estudiantes_id_estudiante_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.estudiantes_id_estudiante_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.estudiantes_id_estudiante_seq OWNER TO postgres;

--
-- TOC entry 5001 (class 0 OID 0)
-- Dependencies: 224
-- Name: estudiantes_id_estudiante_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.estudiantes_id_estudiante_seq OWNED BY public.estudiantes.id_estudiante;


--
-- TOC entry 229 (class 1259 OID 25700)
-- Name: inscripciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inscripciones (
    id_inscripcion integer NOT NULL,
    id_curso integer NOT NULL,
    id_estudiante integer NOT NULL,
    fecha_hora_inscripcion timestamp without time zone NOT NULL,
    id_inscripcion_estado smallint NOT NULL,
    id_usuario_modificacion integer NOT NULL,
    fecha_hora_modificacion timestamp without time zone NOT NULL
);


ALTER TABLE public.inscripciones OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 25662)
-- Name: inscripciones_estados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inscripciones_estados (
    id_inscripcion_estado smallint NOT NULL,
    descripcion character varying(45) NOT NULL,
    es_activo smallint NOT NULL
);


ALTER TABLE public.inscripciones_estados OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 25661)
-- Name: inscripciones_estados_id_inscripcion_estado_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inscripciones_estados_id_inscripcion_estado_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inscripciones_estados_id_inscripcion_estado_seq OWNER TO postgres;

--
-- TOC entry 5002 (class 0 OID 0)
-- Dependencies: 222
-- Name: inscripciones_estados_id_inscripcion_estado_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inscripciones_estados_id_inscripcion_estado_seq OWNED BY public.inscripciones_estados.id_inscripcion_estado;


--
-- TOC entry 228 (class 1259 OID 25699)
-- Name: inscripciones_id_inscripcion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inscripciones_id_inscripcion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inscripciones_id_inscripcion_seq OWNER TO postgres;

--
-- TOC entry 5003 (class 0 OID 0)
-- Dependencies: 228
-- Name: inscripciones_id_inscripcion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inscripciones_id_inscripcion_seq OWNED BY public.inscripciones.id_inscripcion;


--
-- TOC entry 219 (class 1259 OID 25648)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id_usuario integer NOT NULL,
    apellido character varying(100) NOT NULL,
    nombre character varying(100) NOT NULL,
    nombre_usuario character varying(45) NOT NULL,
    contrasenia character varying(100) NOT NULL,
    activo smallint NOT NULL
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 25647)
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_usuario_seq OWNER TO postgres;

--
-- TOC entry 5004 (class 0 OID 0)
-- Dependencies: 218
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_usuario_seq OWNED BY public.usuarios.id_usuario;


--
-- TOC entry 4808 (class 2604 OID 25684)
-- Name: cursos id_curso; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos ALTER COLUMN id_curso SET DEFAULT nextval('public.cursos_id_curso_seq'::regclass);


--
-- TOC entry 4805 (class 2604 OID 25658)
-- Name: cursos_estados id_curso_estado; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos_estados ALTER COLUMN id_curso_estado SET DEFAULT nextval('public.cursos_estados_id_curso_estado_seq'::regclass);


--
-- TOC entry 4807 (class 2604 OID 25672)
-- Name: estudiantes id_estudiante; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estudiantes ALTER COLUMN id_estudiante SET DEFAULT nextval('public.estudiantes_id_estudiante_seq'::regclass);


--
-- TOC entry 4809 (class 2604 OID 25703)
-- Name: inscripciones id_inscripcion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscripciones ALTER COLUMN id_inscripcion SET DEFAULT nextval('public.inscripciones_id_inscripcion_seq'::regclass);


--
-- TOC entry 4806 (class 2604 OID 25665)
-- Name: inscripciones_estados id_inscripcion_estado; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscripciones_estados ALTER COLUMN id_inscripcion_estado SET DEFAULT nextval('public.inscripciones_estados_id_inscripcion_estado_seq'::regclass);


--
-- TOC entry 4804 (class 2604 OID 25651)
-- Name: usuarios id_usuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuarios_id_usuario_seq'::regclass);


--
-- TOC entry 4990 (class 0 OID 25681)
-- Dependencies: 227
-- Data for Name: cursos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cursos (id_curso, nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max, id_curso_estado, id_usuario_modificacion, fecha_hora_modificacion) FROM stdin;
1	Programación Web con React	Desarrollo de aplicaciones web modernas utilizando JavaScript, React y consumo de APIs REST.	2026-04-20	60	30	1	1	2026-04-12 09:00:00
2	Introducción a la Inteligencia Artificial	Conceptos básicos de inteligencia artificial, machine learning y aplicaciones prácticas con Python.	2026-05-05	50	25	1	1	2026-04-12 09:10:00
3	Seguridad Informática y Ethical Hacking	Fundamentos de ciberseguridad, análisis de vulnerabilidades y técnicas de hacking ético.	2026-05-10	70	20	1	1	2026-04-12 09:20:00
4	Bases de Datos SQL y NoSQL	Diseño, consulta y optimización de bases de datos relacionales y no relacionales.	2026-04-25	55	35	1	1	2026-04-12 09:30:00
5	Desarrollo Backend con Node.js y NestJS	Construcción de APIs robustas utilizando Node.js, NestJS y bases de datos SQL.	2026-05-15	65	30	1	1	2026-04-12 09:40:00
\.


--
-- TOC entry 4984 (class 0 OID 25655)
-- Dependencies: 221
-- Data for Name: cursos_estados; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cursos_estados (id_curso_estado, descripcion, es_activo) FROM stdin;
1	BORRADOR	1
2	INSCRIPCIÓN ABIERTA	1
3	INSCRIPCIÓN CERRADA	1
4	ELIMINADO	0
\.


--
-- TOC entry 4988 (class 0 OID 25669)
-- Dependencies: 225
-- Data for Name: estudiantes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estudiantes (id_estudiante, documento, apellido, nombres, email, fecha_nacimiento, activo, id_usuario_modificacion, fecha_hora_modificacion) FROM stdin;
6	35211111	GARCÍA	MATEO EMILIO	mateogarcia@gmail.com	2000-02-15	1	1	2023-03-06 17:30:00
7	28922222	TORRES	SANTIAGO JULIÁN	santiagotorres@gmail.com	1994-05-10	1	1	2023-03-07 18:15:00
8	38133333	GÓMEZ	LUISA LUCIANA	luisalopez@gmail.com	2002-01-05	1	1	2023-03-08 19:00:00
9	31944444	RIVAS	GABRIEL EDUARDO	gabrielrivas@gmail.com	1997-09-25	1	1	2023-03-09 20:45:00
10	34855555	MARTÍNEZ	VALENTINA SOFÍA	valentinamartinez@gmail.com	2000-08-15	1	1	2023-03-10 22:30:00
\.


--
-- TOC entry 4992 (class 0 OID 25700)
-- Dependencies: 229
-- Data for Name: inscripciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inscripciones (id_inscripcion, id_curso, id_estudiante, fecha_hora_inscripcion, id_inscripcion_estado, id_usuario_modificacion, fecha_hora_modificacion) FROM stdin;
\.


--
-- TOC entry 4986 (class 0 OID 25662)
-- Dependencies: 223
-- Data for Name: inscripciones_estados; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inscripciones_estados (id_inscripcion_estado, descripcion, es_activo) FROM stdin;
1	CONFIRMADA	1
2	CANCELADA	0
\.


--
-- TOC entry 4982 (class 0 OID 25648)
-- Dependencies: 219
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id_usuario, apellido, nombre, nombre_usuario, contrasenia, activo) FROM stdin;
1	BIANCHI	LUCIANA	lbianchi	7628ea83cc52ffb1fe875675326a97cd7ca71f1e3da8fba7301db782ba606b45	1
2	FERNÁNDEZ	LORENZO	lfernandez	7845c21dcefd691b0d70063da7c68bcb8a25ac29d0a1dee5fdb8800870f9afae	1
3	RINCÓN	MATEO	mrincon	ade69c2785589f42b82dd048c0f09dcd485c74ada573d334731aa99d7b4627fd	1
4	DECHAT	GUILIANA	gdechat	e0b0e46fd41b7af118b2a65046c207d5b3b8a1c03bc2f9472e7e76efe7a6ed0f	1
5	NOVELLO	IGNACIO	inovello	a1d19e9e32012744ce6864d933c25417bd8faf6b320bcf3ebe91606f1f7f36bc	1
\.


--
-- TOC entry 5005 (class 0 OID 0)
-- Dependencies: 220
-- Name: cursos_estados_id_curso_estado_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cursos_estados_id_curso_estado_seq', 4, true);


--
-- TOC entry 5006 (class 0 OID 0)
-- Dependencies: 226
-- Name: cursos_id_curso_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cursos_id_curso_seq', 1, false);


--
-- TOC entry 5007 (class 0 OID 0)
-- Dependencies: 224
-- Name: estudiantes_id_estudiante_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estudiantes_id_estudiante_seq', 1, false);


--
-- TOC entry 5008 (class 0 OID 0)
-- Dependencies: 222
-- Name: inscripciones_estados_id_inscripcion_estado_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inscripciones_estados_id_inscripcion_estado_seq', 2, true);


--
-- TOC entry 5009 (class 0 OID 0)
-- Dependencies: 228
-- Name: inscripciones_id_inscripcion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inscripciones_id_inscripcion_seq', 1, false);


--
-- TOC entry 5010 (class 0 OID 0)
-- Dependencies: 218
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_usuario_seq', 5, true);


--
-- TOC entry 4813 (class 2606 OID 25660)
-- Name: cursos_estados cursos_estados_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos_estados
    ADD CONSTRAINT cursos_estados_pkey PRIMARY KEY (id_curso_estado);


--
-- TOC entry 4820 (class 2606 OID 25688)
-- Name: cursos cursos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_pkey PRIMARY KEY (id_curso);


--
-- TOC entry 4817 (class 2606 OID 25674)
-- Name: estudiantes estudiantes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT estudiantes_pkey PRIMARY KEY (id_estudiante);


--
-- TOC entry 4815 (class 2606 OID 25667)
-- Name: inscripciones_estados inscripciones_estados_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscripciones_estados
    ADD CONSTRAINT inscripciones_estados_pkey PRIMARY KEY (id_inscripcion_estado);


--
-- TOC entry 4828 (class 2606 OID 25705)
-- Name: inscripciones inscripciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscripciones
    ADD CONSTRAINT inscripciones_pkey PRIMARY KEY (id_inscripcion);


--
-- TOC entry 4811 (class 2606 OID 25653)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario);


--
-- TOC entry 4821 (class 1259 OID 25726)
-- Name: idx_cursos_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cursos_estado ON public.cursos USING btree (id_curso_estado);


--
-- TOC entry 4822 (class 1259 OID 25727)
-- Name: idx_cursos_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cursos_usuario ON public.cursos USING btree (id_usuario_modificacion);


--
-- TOC entry 4818 (class 1259 OID 25728)
-- Name: idx_estudiantes_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_estudiantes_usuario ON public.estudiantes USING btree (id_usuario_modificacion);


--
-- TOC entry 4823 (class 1259 OID 25729)
-- Name: idx_inscripciones_curso; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inscripciones_curso ON public.inscripciones USING btree (id_curso);


--
-- TOC entry 4824 (class 1259 OID 25731)
-- Name: idx_inscripciones_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inscripciones_estado ON public.inscripciones USING btree (id_inscripcion_estado);


--
-- TOC entry 4825 (class 1259 OID 25730)
-- Name: idx_inscripciones_estud; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inscripciones_estud ON public.inscripciones USING btree (id_estudiante);


--
-- TOC entry 4826 (class 1259 OID 25732)
-- Name: idx_inscripciones_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inscripciones_usuario ON public.inscripciones USING btree (id_usuario_modificacion);


--
-- TOC entry 4830 (class 2606 OID 25689)
-- Name: cursos fk_cursos_cursos_estados; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT fk_cursos_cursos_estados FOREIGN KEY (id_curso_estado) REFERENCES public.cursos_estados(id_curso_estado);


--
-- TOC entry 4831 (class 2606 OID 25694)
-- Name: cursos fk_cursos_usuarios; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT fk_cursos_usuarios FOREIGN KEY (id_usuario_modificacion) REFERENCES public.usuarios(id_usuario);


--
-- TOC entry 4829 (class 2606 OID 25675)
-- Name: estudiantes fk_estudiantes_usuarios; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT fk_estudiantes_usuarios FOREIGN KEY (id_usuario_modificacion) REFERENCES public.usuarios(id_usuario);


--
-- TOC entry 4832 (class 2606 OID 25706)
-- Name: inscripciones fk_inscripciones_cursos; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscripciones
    ADD CONSTRAINT fk_inscripciones_cursos FOREIGN KEY (id_curso) REFERENCES public.cursos(id_curso);


--
-- TOC entry 4833 (class 2606 OID 25716)
-- Name: inscripciones fk_inscripciones_estados; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscripciones
    ADD CONSTRAINT fk_inscripciones_estados FOREIGN KEY (id_inscripcion_estado) REFERENCES public.inscripciones_estados(id_inscripcion_estado);


--
-- TOC entry 4834 (class 2606 OID 25711)
-- Name: inscripciones fk_inscripciones_estudiantes; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscripciones
    ADD CONSTRAINT fk_inscripciones_estudiantes FOREIGN KEY (id_estudiante) REFERENCES public.estudiantes(id_estudiante);


--
-- TOC entry 4835 (class 2606 OID 25721)
-- Name: inscripciones fk_inscripciones_usuarios; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscripciones
    ADD CONSTRAINT fk_inscripciones_usuarios FOREIGN KEY (id_usuario_modificacion) REFERENCES public.usuarios(id_usuario);


-- Completed on 2026-04-12 09:41:00

--
-- PostgreSQL database dump complete
--
