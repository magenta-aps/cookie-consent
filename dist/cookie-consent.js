
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let stylesheet;
    let active = 0;
    let current_rules = {};
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        if (!current_rules[name]) {
            if (!stylesheet) {
                const style = element('style');
                document.head.appendChild(style);
                stylesheet = style.sheet;
            }
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        node.style.animation = (node.style.animation || '')
            .split(', ')
            .filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        )
            .join(', ');
        if (name && !--active)
            clear_rules();
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            let i = stylesheet.cssRules.length;
            while (i--)
                stylesheet.deleteRule(i);
            current_rules = {};
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    const seen_callbacks = new Set();
    function flush() {
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.18.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    /* - Copyright (C) 2019 Magenta ApS, http://magenta.dk.
       - Contact: info@magenta.dk.
       -
       - This Source Code Form is subject to the terms of the Mozilla Public
       - License, v. 2.0. If a copy of the MPL was not distributed with this
       - file, You can obtain one at https://mozilla.org/MPL/2.0/. */

    const consent = writable(false);

    const config = writable({
        localStorageId: 'CookieConsentByMagenta-v1-0-0',
        messages: {
            title: 'Samtykke til brug af cookies',
            introduction: 'Vi vil gerne gemme information i din browser.',
            purposes: ['Der er intet formål med det'],
            additionalInfo: '<a href="">Her bør der være et link til yderligere information</a>',
            acceptButtonTxt: 'Ja tak',
            declineButtonTxt: 'Nej tak',
            acceptedTxt: 'accepteret',
            declinedTxt: 'afvist',
            revisionTitleDeclined: 'Du har ikke givet samtykke',
            revisionAskToAccept: 'Du har ikke givet samtykke til brug af cookies. Vil du give samtykke?',
            revisionTitleAccepted: 'Du har givet samtykke',
            revisionAskToDecline: 'Du har givet samtykke til brug af cookies. Har du fortrudt?',
            revisionDeclineAction: 'Træk mit samtykke tilbage',
            revisionCloseDiag: 'Luk samtykke-box'
        },
        delete_cookies_on_decline: false
    });

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 }) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    /* Copyright (C) 2019 Magenta ApS, http://magenta.dk.
       - Contact: info@magenta.dk.
       -
       - This Source Code Form is subject to the terms of the Mozilla Public
       - License, v. 2.0. If a copy of the MPL was not distributed with this
       - file, You can obtain one at https://mozilla.org/MPL/2.0/. */

    // Global events

    let ev_give = document.createEvent('Event'),
        ev_decline = document.createEvent('Event');

    ev_give.initEvent('consentgiven', true, true);
    ev_decline.initEvent('consentdeclined', true, true);


    // Store values

    let conf;

    const conf_subscription = config.subscribe(c => {
        conf = c;
    });


    // Reusable methods

    function sayYes() {
        setConsent(true);
        dispatch$1(true);
    }

    function sayNo() {
        setConsent(false);
        dispatch$1(false);
    }

    function setConsent(consent_boolean) {
        consent.set(consent_boolean);
        localStorage.setItem(conf.localStorageId, consent_boolean);
    }

    function dispatch$1(consent_boolean) {
        if (consent_boolean === true) {
            document.dispatchEvent(ev_give);
        } else if (consent_boolean === false) {
            clearCookies();
            document.dispatchEvent(ev_decline);
        }
    }

    function clearCookies() {
        
        const del_cookies = conf.delete_cookies_on_decline;
        const all_cookie_names = document.cookie.split(' ').map(function(c) {
            return c.split('=')[0]
        });

        function delCookie(name) {
            document.cookie = `${ name }=; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
        }
        if (del_cookies) { // If cookie names were supplied, only delete cookies with those names
            const select_cookies = all_cookie_names.filter(function(cookie) {
                return del_cookies.find(function(cn) {
                    return cn === cookie
                })
            });
            select_cookies.forEach(function(name) {
                delCookie(name);
            });
        } else { // Just delete all the cookies
            all_cookie_names.forEach(function(name) {
                delCookie(name);
            });
        }
    }

    /* src/CCGive.svelte generated by Svelte v3.18.1 */

    const file = "src/CCGive.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (53:0) {#if $consent === null}
    function create_if_block(ctx) {
    	let div;
    	let h2;
    	let t0_value = /*$config*/ ctx[0].messages.title + "";
    	let t0;
    	let t1;
    	let p0;
    	let t2_value = /*$config*/ ctx[0].messages.introduction + "";
    	let t2;
    	let t3;
    	let ul;
    	let t4;
    	let p1;
    	let raw_value = /*$config*/ ctx[0].messages.additionalInfo + "";
    	let t5;
    	let p2;
    	let button0;
    	let t6_value = /*$config*/ ctx[0].messages.acceptButtonTxt + "";
    	let t6;
    	let t7;
    	let button1;
    	let t8_value = /*$config*/ ctx[0].messages.declineButtonTxt + "";
    	let t8;
    	let div_transition;
    	let current;
    	let dispose;
    	let each_value = /*$config*/ ctx[0].messages.purposes;
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			t0 = text(t0_value);
    			t1 = space();
    			p0 = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			p1 = element("p");
    			t5 = space();
    			p2 = element("p");
    			button0 = element("button");
    			t6 = text(t6_value);
    			t7 = space();
    			button1 = element("button");
    			t8 = text(t8_value);
    			attr_dev(h2, "id", "give-consent-title");
    			attr_dev(h2, "class", "cc-title");
    			add_location(h2, file, 59, 8, 1579);
    			attr_dev(p0, "class", "cc-intro");
    			add_location(p0, file, 60, 8, 1664);
    			attr_dev(ul, "class", "cc-list");
    			add_location(ul, file, 61, 8, 1730);
    			attr_dev(p1, "class", "cc-additional");
    			add_location(p1, file, 66, 8, 1914);
    			attr_dev(button0, "aria-controls", "cookie-consent-diag");
    			attr_dev(button0, "class", "cc-accept");
    			add_location(button0, file, 68, 12, 2028);
    			attr_dev(button1, "aria-controls", "cookie-consent-diag");
    			attr_dev(button1, "class", "cc-decline");
    			add_location(button1, file, 69, 12, 2168);
    			attr_dev(p2, "class", "cc-actions");
    			add_location(p2, file, 67, 8, 1993);
    			attr_dev(div, "class", "cc-diag");
    			attr_dev(div, "role", "alertdialog");
    			attr_dev(div, "aria-live", "assertive");
    			attr_dev(div, "aria-labelledby", "give-consent-title");
    			add_location(div, file, 53, 4, 1385);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(h2, t0);
    			append_dev(div, t1);
    			append_dev(div, p0);
    			append_dev(p0, t2);
    			append_dev(div, t3);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(div, t4);
    			append_dev(div, p1);
    			p1.innerHTML = raw_value;
    			append_dev(div, t5);
    			append_dev(div, p2);
    			append_dev(p2, button0);
    			append_dev(button0, t6);
    			append_dev(p2, t7);
    			append_dev(p2, button1);
    			append_dev(button1, t8);
    			current = true;

    			dispose = [
    				listen_dev(button0, "click", sayYes, false, false, false),
    				listen_dev(button1, "click", sayNo, false, false, false)
    			];
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*$config*/ 1) && t0_value !== (t0_value = /*$config*/ ctx[0].messages.title + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty & /*$config*/ 1) && t2_value !== (t2_value = /*$config*/ ctx[0].messages.introduction + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*$config*/ 1) {
    				each_value = /*$config*/ ctx[0].messages.purposes;
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if ((!current || dirty & /*$config*/ 1) && raw_value !== (raw_value = /*$config*/ ctx[0].messages.additionalInfo + "")) p1.innerHTML = raw_value;			if ((!current || dirty & /*$config*/ 1) && t6_value !== (t6_value = /*$config*/ ctx[0].messages.acceptButtonTxt + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty & /*$config*/ 1) && t8_value !== (t8_value = /*$config*/ ctx[0].messages.declineButtonTxt + "")) set_data_dev(t8, t8_value);
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { y: -300, duration: 300 }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { y: -300, duration: 300 }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (detaching && div_transition) div_transition.end();
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(53:0) {#if $consent === null}",
    		ctx
    	});

    	return block;
    }

    // (63:12) {#each $config.messages.purposes as purpose}
    function create_each_block(ctx) {
    	let li;
    	let raw_value = /*purpose*/ ctx[4] + "";

    	const block = {
    		c: function create() {
    			li = element("li");
    			attr_dev(li, "class", "cc-list-item");
    			add_location(li, file, 63, 16, 1824);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			li.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$config*/ 1 && raw_value !== (raw_value = /*purpose*/ ctx[4] + "")) li.innerHTML = raw_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(63:12) {#each $config.messages.purposes as purpose}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$consent*/ ctx[1] === null && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$consent*/ ctx[1] === null) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    					transition_in(if_block, 1);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $config;
    	let $consent;
    	validate_store(config, "config");
    	component_subscribe($$self, config, $$value => $$invalidate(0, $config = $$value));
    	validate_store(consent, "consent");
    	component_subscribe($$self, consent, $$value => $$invalidate(1, $consent = $$value));
    	let { cc_config } = $$props;

    	// Methods 
    	function checkConsent() {
    		let str = localStorage.getItem($config.localStorageId);

    		if (str) {
    			let c = str === "true";
    			consent.set(c);
    			dispatch$1(c);
    		} else {
    			consent.set(null);
    		}
    	}

    	// Initialize
    	onMount(async () => {
    		config.update(c => {
    			let conf = c;

    			if (cc_config.localStorageId) {
    				conf.localStorageId = cc_config.localStorageId;
    			}

    			if (cc_config.messages) {
    				for (let m in cc_config.messages) {
    					conf.messages[m] = cc_config.messages[m];
    				}
    			}

    			if (cc_config.delete_cookies_on_decline) {
    				conf.delete_cookies_on_decline = cc_config.delete_cookies_on_decline;
    			}

    			return conf;
    		});

    		checkConsent();
    	});

    	const writable_props = ["cc_config"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<CCGive> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("cc_config" in $$props) $$invalidate(2, cc_config = $$props.cc_config);
    	};

    	$$self.$capture_state = () => {
    		return { cc_config, $config, $consent };
    	};

    	$$self.$inject_state = $$props => {
    		if ("cc_config" in $$props) $$invalidate(2, cc_config = $$props.cc_config);
    		if ("$config" in $$props) config.set($config = $$props.$config);
    		if ("$consent" in $$props) consent.set($consent = $$props.$consent);
    	};

    	return [$config, $consent, cc_config];
    }

    class CCGive extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { cc_config: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CCGive",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*cc_config*/ ctx[2] === undefined && !("cc_config" in props)) {
    			console.warn("<CCGive> was created without expected prop 'cc_config'");
    		}
    	}

    	get cc_config() {
    		throw new Error("<CCGive>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cc_config(value) {
    		throw new Error("<CCGive>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/CCRevise.svelte generated by Svelte v3.18.1 */

    const file$1 = "src/CCRevise.svelte";

    // (34:0) {#if $consent !== null && !toggle }
    function create_if_block_2(ctx) {
    	let p;
    	let t0;

    	let t1_value = (/*$consent*/ ctx[1]
    	? /*$config*/ ctx[2].messages.acceptedTxt
    	: /*$config*/ ctx[2].messages.declinedTxt) + "";

    	let t1;
    	let t2;
    	let button;
    	let t3_value = /*$config*/ ctx[2].messages.editConsent + "";
    	let t3;
    	let dispose;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Cookies ");
    			t1 = text(t1_value);
    			t2 = space();
    			button = element("button");
    			t3 = text(t3_value);
    			attr_dev(button, "class", "cc-toggle-btn");
    			add_location(button, file$1, 36, 8, 975);
    			attr_dev(p, "class", "cc-toggle");
    			attr_dev(p, "role", "status");
    			attr_dev(p, "aria-live", "assertive");
    			add_location(p, file$1, 34, 4, 817);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			append_dev(p, button);
    			append_dev(button, t3);
    			dispose = listen_dev(button, "click", /*toggleConsentEdit*/ ctx[5], false, false, false);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$consent, $config*/ 6 && t1_value !== (t1_value = (/*$consent*/ ctx[1]
    			? /*$config*/ ctx[2].messages.acceptedTxt
    			: /*$config*/ ctx[2].messages.declinedTxt) + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*$config*/ 4 && t3_value !== (t3_value = /*$config*/ ctx[2].messages.editConsent + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(34:0) {#if $consent !== null && !toggle }",
    		ctx
    	});

    	return block;
    }

    // (41:0) {#if $consent !== null && toggle }
    function create_if_block$1(ctx) {
    	let div;
    	let button;
    	let button_title_value;
    	let button_aria_label_value;
    	let t;
    	let div_transition;
    	let current;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*$consent*/ ctx[1]) return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			t = space();
    			if_block.c();
    			attr_dev(button, "class", "cc-close");
    			attr_dev(button, "title", button_title_value = /*$config*/ ctx[2].messages.revisionCloseDiag);
    			attr_dev(button, "aria-label", button_aria_label_value = /*$config*/ ctx[2].messages.revisionCloseDiag);
    			add_location(button, file$1, 46, 8, 1334);
    			attr_dev(div, "class", "cc-revise-diag");
    			attr_dev(div, "role", "alertdialog");
    			attr_dev(div, "aria-live", "assertive");
    			attr_dev(div, "aria-labelledby", "revise-consent-title");
    			add_location(div, file$1, 41, 4, 1133);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(div, t);
    			if_block.m(div, null);
    			current = true;
    			dispose = listen_dev(button, "click", /*toggleConsentEdit*/ ctx[5], false, false, false);
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*$config*/ 4 && button_title_value !== (button_title_value = /*$config*/ ctx[2].messages.revisionCloseDiag)) {
    				attr_dev(button, "title", button_title_value);
    			}

    			if (!current || dirty & /*$config*/ 4 && button_aria_label_value !== (button_aria_label_value = /*$config*/ ctx[2].messages.revisionCloseDiag)) {
    				attr_dev(button, "aria-label", button_aria_label_value);
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { y: 300, duration: 300 }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { y: 300, duration: 300 }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    			if (detaching && div_transition) div_transition.end();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(41:0) {#if $consent !== null && toggle }",
    		ctx
    	});

    	return block;
    }

    // (55:8) {:else}
    function create_else_block(ctx) {
    	let h2;
    	let t0_value = /*$config*/ ctx[2].messages.revisionTitleDeclined + "";
    	let t0;
    	let t1;
    	let p0;
    	let raw_value = /*$config*/ ctx[2].messages.additionalInfo + "";
    	let t2;
    	let p1;
    	let t3_value = /*$config*/ ctx[2].messages.revisionAskToAccept + "";
    	let t3;
    	let t4;
    	let p2;
    	let button;
    	let t5_value = /*$config*/ ctx[2].messages.acceptButtonTxt + "";
    	let t5;
    	let dispose;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t0 = text(t0_value);
    			t1 = space();
    			p0 = element("p");
    			t2 = space();
    			p1 = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			p2 = element("p");
    			button = element("button");
    			t5 = text(t5_value);
    			attr_dev(h2, "id", "revise-consent-title");
    			attr_dev(h2, "class", "cc-title");
    			add_location(h2, file$1, 55, 12, 2029);
    			attr_dev(p0, "class", "cc-additional");
    			add_location(p0, file$1, 56, 12, 2136);
    			attr_dev(p1, "class", "cc-ask-again");
    			add_location(p1, file$1, 57, 12, 2219);
    			attr_dev(button, "aria-controls", "cookie-consent-diag");
    			attr_dev(button, "class", "cc-accept");
    			add_location(button, file$1, 59, 16, 2339);
    			attr_dev(p2, "class", "cc-actions");
    			add_location(p2, file$1, 58, 12, 2300);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p0, anchor);
    			p0.innerHTML = raw_value;
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, t3);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, p2, anchor);
    			append_dev(p2, button);
    			append_dev(button, t5);
    			dispose = listen_dev(button, "click", /*sayYesAgain*/ ctx[3], false, false, false);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$config*/ 4 && t0_value !== (t0_value = /*$config*/ ctx[2].messages.revisionTitleDeclined + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*$config*/ 4 && raw_value !== (raw_value = /*$config*/ ctx[2].messages.additionalInfo + "")) p0.innerHTML = raw_value;			if (dirty & /*$config*/ 4 && t3_value !== (t3_value = /*$config*/ ctx[2].messages.revisionAskToAccept + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*$config*/ 4 && t5_value !== (t5_value = /*$config*/ ctx[2].messages.acceptButtonTxt + "")) set_data_dev(t5, t5_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(p2);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(55:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (48:8) {#if $consent}
    function create_if_block_1(ctx) {
    	let h2;
    	let t0_value = /*$config*/ ctx[2].messages.revisionTitleAccepted + "";
    	let t0;
    	let t1;
    	let p0;
    	let raw_value = /*$config*/ ctx[2].messages.additionalInfo + "";
    	let t2;
    	let p1;
    	let t3_value = /*$config*/ ctx[2].messages.revisionAskToDecline + "";
    	let t3;
    	let t4;
    	let p2;
    	let button;
    	let t5_value = /*$config*/ ctx[2].messages.revisionDeclineAction + "";
    	let t5;
    	let dispose;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t0 = text(t0_value);
    			t1 = space();
    			p0 = element("p");
    			t2 = space();
    			p1 = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			p2 = element("p");
    			button = element("button");
    			t5 = text(t5_value);
    			attr_dev(h2, "id", "revise-consent-title");
    			attr_dev(h2, "class", "cc-title");
    			add_location(h2, file$1, 48, 12, 1534);
    			attr_dev(p0, "class", "cc-additional");
    			add_location(p0, file$1, 49, 12, 1641);
    			attr_dev(p1, "class", "cc-ask-again");
    			add_location(p1, file$1, 50, 12, 1724);
    			attr_dev(button, "aria-controls", "cookie-consent-diag");
    			attr_dev(button, "class", "cc-decline");
    			add_location(button, file$1, 52, 16, 1845);
    			attr_dev(p2, "class", "cc-actions");
    			add_location(p2, file$1, 51, 12, 1806);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p0, anchor);
    			p0.innerHTML = raw_value;
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, t3);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, p2, anchor);
    			append_dev(p2, button);
    			append_dev(button, t5);
    			dispose = listen_dev(button, "click", /*sayNoAgain*/ ctx[4], false, false, false);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$config*/ 4 && t0_value !== (t0_value = /*$config*/ ctx[2].messages.revisionTitleAccepted + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*$config*/ 4 && raw_value !== (raw_value = /*$config*/ ctx[2].messages.additionalInfo + "")) p0.innerHTML = raw_value;			if (dirty & /*$config*/ 4 && t3_value !== (t3_value = /*$config*/ ctx[2].messages.revisionAskToDecline + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*$config*/ 4 && t5_value !== (t5_value = /*$config*/ ctx[2].messages.revisionDeclineAction + "")) set_data_dev(t5, t5_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(p2);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(48:8) {#if $consent}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*$consent*/ ctx[1] !== null && !/*toggle*/ ctx[0] && create_if_block_2(ctx);
    	let if_block1 = /*$consent*/ ctx[1] !== null && /*toggle*/ ctx[0] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$consent*/ ctx[1] !== null && !/*toggle*/ ctx[0]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*$consent*/ ctx[1] !== null && /*toggle*/ ctx[0]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    					transition_in(if_block1, 1);
    				} else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $consent;
    	let $config;
    	validate_store(consent, "consent");
    	component_subscribe($$self, consent, $$value => $$invalidate(1, $consent = $$value));
    	validate_store(config, "config");
    	component_subscribe($$self, config, $$value => $$invalidate(2, $config = $$value));
    	let toggle = false;

    	// Methods
    	function sayYesAgain() {
    		toggleConsentEdit();
    		sayYes();
    	}

    	function sayNoAgain() {
    		toggleConsentEdit();
    		sayNo();
    	}

    	function toggleConsentEdit() {
    		$$invalidate(0, toggle = !toggle);
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("toggle" in $$props) $$invalidate(0, toggle = $$props.toggle);
    		if ("$consent" in $$props) consent.set($consent = $$props.$consent);
    		if ("$config" in $$props) config.set($config = $$props.$config);
    	};

    	return [toggle, $consent, $config, sayYesAgain, sayNoAgain, toggleConsentEdit];
    }

    class CCRevise extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CCRevise",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /**
     * @license MPL-2.0 Copyright (C) 2020 Magenta ApS, http://magenta.dk. Contact: info@magenta.dk. This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
     */

    // Add consent giving component
    const cc_give_consent = new CCGive({
    	target: document.body,
    	anchor: document.body.children[0],
    	props: {
    		cc_config: cookie_consent_config // `cookie_consent_config` is a varialbe declared in global scope
    	}
    });

    // Add consent revision component
    const cc_revise_consent = new CCRevise({
    	target: document.body
    });

    var main = {
    	cc_give_consent,
    	cc_revise_consent
    };

    return main;

}());
//# sourceMappingURL=cookie-consent.js.map
