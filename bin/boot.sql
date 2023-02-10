--
-- PostgreSQL database dump
--

-- Dumped from database version 12.12 (Ubuntu 12.12-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.12 (Ubuntu 12.12-0ubuntu0.20.04.1)

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
-- Data for Name: archivo; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.archivo (id, originalname, mimetype, destination, filename, path, size) FROM stdin;
\.


--
-- Data for Name: box; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.box (id, largo, ancho, alto) FROM stdin;
1	100.00	120.00	170.00
2	100.00	100.00	100.00
3	1.00	1.00	1.00
\.


--
-- Data for Name: empresa; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.empresa (id, nombre, "identLegal") FROM stdin;
1	Chilean Trading	123456789
\.


--
-- Data for Name: cliente; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cliente (id, nombre, "identLegal", "empresaId") FROM stdin;
1	Cencosud	13297015-7	1
\.


--
-- Data for Name: unidad_negocio; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.unidad_negocio (id, nombre, "clienteId") FROM stdin;
1	Jumbo	1
2	Sisa	1
\.


--
-- Data for Name: local; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.local (id, codigo, nombre, "unidadId") FROM stdin;
\.


--
-- Data for Name: pedido; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pedido (id, "firstName", "lastName", "clienteId") FROM stdin;
\.


--
-- Data for Name: orden_compra; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orden_compra (id, numero, emision, entrega, "unidadId", "pedidoId") FROM stdin;
\.


--
-- Data for Name: producto; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.producto (id, nombre, codigo, peso, "codCenco", vigente, "boxId", "empresaId") FROM stdin;
1	Producto de prueba	1234567	1	1647753	t	3	1
\.


--
-- Data for Name: linea_detalle; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.linea_detalle (id, cantidad, "productoId", "localId", estado, "ordenCompraId") FROM stdin;
\.


--
-- Data for Name: pallet; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pallet (id, hu, "ordenCompraId", "localId", "boxId") FROM stdin;
\.


--
-- Data for Name: caja; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.caja (id, "lineaId", "palletId") FROM stdin;
\.


--
-- Data for Name: proto_pallet; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.proto_pallet (id, nombre, "boxId") FROM stdin;
1	Standard Pallet	1
2	Pallet 1m3	2
\.


--
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.usuario (id, email, password, "esAdmin", "empresaId") FROM stdin;
1	info@welinux.cl	123456	f	1
\.


--
-- Data for Name: token; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.token (id, creado, actualizado, "usuarioId") FROM stdin;
be08bcaa-4b69-4105-b4fc-81f8549b156a	2022-12-10 07:31:45.17549	2022-12-10 07:31:45.17549	1
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."user" (id, "firstName", "lastName") FROM stdin;
\.


--
-- Name: archivo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.archivo_id_seq', 1, false);


--
-- Name: box_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.box_id_seq', 3, true);


--
-- Name: caja_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.caja_id_seq', 1, false);


--
-- Name: cliente_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cliente_id_seq', 1, true);


--
-- Name: empresa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.empresa_id_seq', 1, true);


--
-- Name: linea_detalle_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.linea_detalle_id_seq', 1, false);


--
-- Name: local_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.local_id_seq', 1, false);


--
-- Name: pallet_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.pallet_id_seq', 1, false);


--
-- Name: pedido_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.pedido_id_seq', 1, false);


--
-- Name: producto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.producto_id_seq', 1, true);


--
-- Name: proto_pallet_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.proto_pallet_id_seq', 2, true);


--
-- Name: unidad_negocio_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.unidad_negocio_id_seq', 2, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_id_seq', 1, false);


--
-- Name: usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.usuario_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--

