// Antes de Clicar: rastreamento, barra fixa e vitrine de páginas.
(function () {
    'use strict';

    var PRODUTO = { content_name: 'Guia Antes de Clicar', value: 27.90, currency: 'BRL' };

    function pixel(evento, dados) {
        if (typeof window.fbq === 'function') {
            window.fbq('track', evento, dados);
        }
    }

    var linksCheckout = document.querySelectorAll('a[data-checkout]');

    // 1. Repassa as UTMs e o fbclid do anúncio para o checkout da Cakto (atribuição das vendas).
    try {
        var atual = new URLSearchParams(window.location.search);
        var chaves = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id', 'fbclid', 'sck', 'src'];
        var repassar = [];
        chaves.forEach(function (k) {
            var v = atual.get(k);
            if (v) repassar.push([k, v]);
        });
        if (repassar.length) {
            linksCheckout.forEach(function (a) {
                var url = new URL(a.href);
                repassar.forEach(function (par) { url.searchParams.set(par[0], par[1]); });
                a.href = url.toString();
            });
        }
    } catch (e) { /* navegador antigo: segue sem repassar */ }

    // 2. Pixel: clique em qualquer botão de compra = InitiateCheckout.
    linksCheckout.forEach(function (a) {
        a.addEventListener('click', function () {
            pixel('InitiateCheckout', PRODUTO);
        });
    });

    var temObservador = 'IntersectionObserver' in window;

    // 3. Pixel: ViewContent uma única vez, quando a oferta aparece na tela.
    var oferta = document.getElementById('oferta');
    if (temObservador && oferta) {
        var viu = false;
        var obsOferta = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (e) {
                if (e.isIntersecting && !viu) {
                    viu = true;
                    pixel('ViewContent', PRODUTO);
                    obsOferta.disconnect();
                }
            });
        }, { threshold: 0.35 });
        obsOferta.observe(oferta);
    }

    // 4. Barra fixa no celular: aparece depois do primeiro botão,
    //    e some quando a oferta ou o fechamento já mostram um botão.
    var barra = document.getElementById('barra-fixa');
    var alvos = ['cta-topo', 'oferta', 'final']
        .map(function (id) { return document.getElementById(id); })
        .filter(Boolean);

    if (temObservador && barra && alvos.length) {
        var visiveis = {};
        var passouDoTopo = false;
        var linkBarra = barra.querySelector('a');

        var atualizar = function () {
            var algumBotaoNaTela = Object.keys(visiveis).some(function (k) { return visiveis[k]; });
            var mostrar = passouDoTopo && !algumBotaoNaTela;
            barra.classList.toggle('visivel', mostrar);
            barra.setAttribute('aria-hidden', mostrar ? 'false' : 'true');
            if (linkBarra) linkBarra.tabIndex = mostrar ? 0 : -1;
        };

        var obsBarra = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (e) {
                visiveis[e.target.id] = e.isIntersecting;
                if (e.target.id === 'cta-topo' && !e.isIntersecting && e.boundingClientRect.top < 0) {
                    passouDoTopo = true;
                }
                if (e.target.id === 'cta-topo' && e.isIntersecting) {
                    passouDoTopo = false;
                }
            });
            atualizar();
        }, { threshold: 0 });

        alvos.forEach(function (el) { obsBarra.observe(el); });
    }

    // 5. A caneta começa a marcar quando a mensagem aparece na tela.
    var celular = document.querySelector('.celular');
    if (celular) {
        if (temObservador) {
            var obsCelular = new IntersectionObserver(function (entradas) {
                entradas.forEach(function (e) {
                    if (e.isIntersecting) {
                        celular.classList.add('anotar');
                        obsCelular.disconnect();
                    }
                });
            }, { threshold: 0.45 });
            obsCelular.observe(celular);
        } else {
            celular.classList.add('anotar');
        }
    }

    // 6. Vitrine: setas no computador.
    var galeria = document.querySelector('.galeria');
    document.querySelectorAll('[data-galeria]').forEach(function (botao) {
        botao.addEventListener('click', function () {
            if (!galeria) return;
            var item = galeria.querySelector('li');
            var passo = item ? item.getBoundingClientRect().width + 18 : 280;
            galeria.scrollBy({ left: passo * 2 * Number(botao.getAttribute('data-galeria')), behavior: 'smooth' });
        });
    });
})();
