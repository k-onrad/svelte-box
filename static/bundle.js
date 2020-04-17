
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    const has_prop = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
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
    function element(name) {
        return document.createElement(name);
    }
    function object_without_properties(obj, exclude) {
        const target = {};
        for (const k in obj) {
            if (has_prop(obj, k)
                // @ts-ignore
                && exclude.indexOf(k) === -1) {
                // @ts-ignore
                target[k] = obj[k];
            }
        }
        return target;
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
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
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
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
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
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
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
        flushing = false;
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

    const globals = (typeof window !== 'undefined' ? window : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next, lookup.has(block.key));
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error(`Cannot have duplicate keys in a keyed each`);
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
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
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.20.1' }, detail)));
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
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
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
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe,
        };
    }
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
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function regexparam (str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules/svelte-spa-router/Router.svelte generated by Svelte v3.20.1 */

    const { Error: Error_1, Object: Object_1, console: console_1 } = globals;

    // (209:0) {:else}
    function create_else_block(ctx) {
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[10]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[10]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(209:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (207:0) {#if componentParams}
    function create_if_block(ctx) {
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		return {
    			props: { params: /*componentParams*/ ctx[1] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props(ctx));
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[9]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*componentParams*/ 2) switch_instance_changes.params = /*componentParams*/ ctx[1];

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[9]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(207:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
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
    			if_blocks[current_block_type_index].d(detaching);
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

    function wrap(route, userData, ...conditions) {
    	// Check if we don't have userData
    	if (userData && typeof userData == "function") {
    		conditions = conditions && conditions.length ? conditions : [];
    		conditions.unshift(userData);
    		userData = undefined;
    	}

    	// Parameter route and each item of conditions must be functions
    	if (!route || typeof route != "function") {
    		throw Error("Invalid parameter route");
    	}

    	if (conditions && conditions.length) {
    		for (let i = 0; i < conditions.length; i++) {
    			if (!conditions[i] || typeof conditions[i] != "function") {
    				throw Error("Invalid parameter conditions[" + i + "]");
    			}
    		}
    	}

    	// Returns an object that contains all the functions to execute too
    	const obj = { route, userData };

    	if (conditions && conditions.length) {
    		obj.conditions = conditions;
    	}

    	// The _sveltesparouter flag is to confirm the object was created by this router
    	Object.defineProperty(obj, "_sveltesparouter", { value: true });

    	return obj;
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf("#/");

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: "/";

    	// Check if there's a querystring
    	const qsPosition = location.indexOf("?");

    	let querystring = "";

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(getLocation(), // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener("hashchange", update, false);

    	return function stop() {
    		window.removeEventListener("hashchange", update, false);
    	};
    });

    const location = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);

    function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != "/" && location.indexOf("#/") !== 0) {
    		throw Error("Invalid parameter location");
    	}

    	// Execute this code when the current call stack is complete
    	return nextTickPromise(() => {
    		window.location.hash = (location.charAt(0) == "#" ? "" : "#") + location;
    	});
    }

    function pop() {
    	// Execute this code when the current call stack is complete
    	return nextTickPromise(() => {
    		window.history.back();
    	});
    }

    function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != "/" && location.indexOf("#/") !== 0) {
    		throw Error("Invalid parameter location");
    	}

    	// Execute this code when the current call stack is complete
    	return nextTickPromise(() => {
    		const dest = (location.charAt(0) == "#" ? "" : "#") + location;

    		try {
    			window.history.replaceState(undefined, undefined, dest);
    		} catch(e) {
    			// eslint-disable-next-line no-console
    			console.warn("Caught exception while replacing the current page. If you're running this in the Svelte REPL, please note that the `replace` method might not work in this environment.");
    		}

    		// The method above doesn't trigger the hashchange event, so let's do that manually
    		window.dispatchEvent(new Event("hashchange"));
    	});
    }

    function link(node) {
    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != "a") {
    		throw Error("Action \"link\" can only be used with <a> tags");
    	}

    	// Destination must start with '/'
    	const href = node.getAttribute("href");

    	if (!href || href.length < 1 || href.charAt(0) != "/") {
    		throw Error("Invalid value for \"href\" attribute");
    	}

    	// Add # to every href attribute
    	node.setAttribute("href", "#" + href);
    }

    function nextTickPromise(cb) {
    	return new Promise(resolve => {
    			setTimeout(
    				() => {
    					resolve(cb());
    				},
    				0
    			);
    		});
    }

    function instance($$self, $$props, $$invalidate) {
    	let $loc,
    		$$unsubscribe_loc = noop;

    	validate_store(loc, "loc");
    	component_subscribe($$self, loc, $$value => $$invalidate(4, $loc = $$value));
    	$$self.$$.on_destroy.push(() => $$unsubscribe_loc());
    	let { routes = {} } = $$props;
    	let { prefix = "" } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent} component - Svelte component for the route
     */
    		constructor(path, component) {
    			if (!component || typeof component != "function" && (typeof component != "object" || component._sveltesparouter !== true)) {
    				throw Error("Invalid component object");
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == "string" && (path.length < 1 || path.charAt(0) != "/" && path.charAt(0) != "*") || typeof path == "object" && !(path instanceof RegExp)) {
    				throw Error("Invalid value for \"path\" argument");
    			}

    			const { pattern, keys } = regexparam(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == "object" && component._sveltesparouter === true) {
    				this.component = component.route;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    			} else {
    				this.component = component;
    				this.conditions = [];
    				this.userData = undefined;
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, remove it before we run the matching
    			if (prefix && path.startsWith(prefix)) {
    				path = path.substr(prefix.length) || "/";
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				out[this._keys[i]] = matches[++i] || null;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {SvelteComponent} component - Svelte component
     * @property {string} name - Name of the Svelte component
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {Object} [userData] - Custom data passed by the user
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {bool} Returns true if all the conditions succeeded
     */
    		checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	const dispatchNextTick = (name, detail) => {
    		// Execute this code when the current call stack is complete
    		setTimeout(
    			() => {
    				dispatch(name, detail);
    			},
    			0
    		);
    	};

    	const writable_props = ["routes", "prefix"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Router", $$slots, []);

    	function routeEvent_handler(event) {
    		bubble($$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$props => {
    		if ("routes" in $$props) $$invalidate(2, routes = $$props.routes);
    		if ("prefix" in $$props) $$invalidate(3, prefix = $$props.prefix);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		derived,
    		wrap,
    		getLocation,
    		loc,
    		location,
    		querystring,
    		push,
    		pop,
    		replace,
    		link,
    		nextTickPromise,
    		createEventDispatcher,
    		regexparam,
    		routes,
    		prefix,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		dispatch,
    		dispatchNextTick,
    		$loc
    	});

    	$$self.$inject_state = $$props => {
    		if ("routes" in $$props) $$invalidate(2, routes = $$props.routes);
    		if ("prefix" in $$props) $$invalidate(3, prefix = $$props.prefix);
    		if ("component" in $$props) $$invalidate(0, component = $$props.component);
    		if ("componentParams" in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*component, $loc*/ 17) {
    			// Handle hash change events
    			// Listen to changes in the $loc store and update the page
    			 {
    				// Find a route matching the location
    				$$invalidate(0, component = null);

    				let i = 0;

    				while (!component && i < routesList.length) {
    					const match = routesList[i].match($loc.location);

    					if (match) {
    						const detail = {
    							component: routesList[i].component,
    							name: routesList[i].component.name,
    							location: $loc.location,
    							querystring: $loc.querystring,
    							userData: routesList[i].userData
    						};

    						// Check if the route can be loaded - if all conditions succeed
    						if (!routesList[i].checkConditions(detail)) {
    							// Trigger an event to notify the user
    							dispatchNextTick("conditionsFailed", detail);

    							break;
    						}

    						$$invalidate(0, component = routesList[i].component);

    						// Set componentParams onloy if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    						// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    						if (match && typeof match == "object" && Object.keys(match).length) {
    							$$invalidate(1, componentParams = match);
    						} else {
    							$$invalidate(1, componentParams = null);
    						}

    						dispatchNextTick("routeLoaded", detail);
    					}

    					i++;
    				}
    			}
    		}
    	};

    	return [
    		component,
    		componentParams,
    		routes,
    		prefix,
    		$loc,
    		RouteItem,
    		routesList,
    		dispatch,
    		dispatchNextTick,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { routes: 2, prefix: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/routes/home/HomePage.svelte generated by Svelte v3.20.1 */

    const file = "src/routes/home/HomePage.svelte";

    function create_fragment$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "HOME PAGE";
    			add_location(div, file, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
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

    function instance$1($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<HomePage> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("HomePage", $$slots, []);
    	return [];
    }

    class HomePage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HomePage",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/routes/example/Example.svelte generated by Svelte v3.20.1 */

    const file$1 = "src/routes/example/Example.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let h3;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			h3.textContent = "Example page";
    			add_location(h3, file$1, 1, 0, 6);
    			add_location(div, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Example> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Example", $$slots, []);
    	return [];
    }

    class Example extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Example",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/routes/not-found/NotFound.svelte generated by Svelte v3.20.1 */

    const file$2 = "src/routes/not-found/NotFound.svelte";

    function create_fragment$3(ctx) {
    	let div1;
    	let div0;
    	let h2;
    	let t1;
    	let h3;
    	let t3;
    	let p;
    	let t5;
    	let button;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "404";
    			t1 = space();
    			h3 = element("h3");
    			h3.textContent = "Page not found!";
    			t3 = space();
    			p = element("p");
    			p.textContent = "Check if the url really exists.";
    			t5 = space();
    			button = element("button");
    			button.textContent = "← Go Back";
    			add_location(h2, file$2, 2, 4, 55);
    			add_location(h3, file$2, 3, 4, 72);
    			add_location(p, file$2, 4, 4, 101);
    			attr_dev(button, "type", "button");
    			set_style(button, "margin-top", "8px");
    			attr_dev(button, "class", "btn btn-accent btn-pill");
    			add_location(button, file$2, 5, 4, 144);
    			attr_dev(div0, "class", "error__content");
    			add_location(div0, file$2, 1, 2, 22);
    			attr_dev(div1, "class", "error");
    			add_location(div1, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h2);
    			append_dev(div0, t1);
    			append_dev(div0, h3);
    			append_dev(div0, t3);
    			append_dev(div0, p);
    			append_dev(div0, t5);
    			append_dev(div0, button);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<NotFound> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("NotFound", $$slots, []);
    	return [];
    }

    class NotFound extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NotFound",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    const routes = new Map();
    routes.set('/', HomePage);
    routes.set('/example', Example);
    routes.set('*', NotFound);

    /* src/layouts/main/layout-components/top-bar/TopBar.svelte generated by Svelte v3.20.1 */

    const file$3 = "src/layouts/main/layout-components/top-bar/TopBar.svelte";

    function create_fragment$4(ctx) {
    	let div13;
    	let nav1;
    	let form;
    	let div2;
    	let div1;
    	let div0;
    	let i0;
    	let t0;
    	let input;
    	let t1;
    	let ul;
    	let li0;
    	let a0;
    	let div3;
    	let i1;
    	let t3;
    	let span0;
    	let t5;
    	let div10;
    	let a1;
    	let div5;
    	let div4;
    	let i2;
    	let t7;
    	let div6;
    	let span1;
    	let t9;
    	let p0;
    	let t10;
    	let span2;
    	let t12;
    	let t13;
    	let a2;
    	let div8;
    	let div7;
    	let i3;
    	let t15;
    	let div9;
    	let span3;
    	let t17;
    	let p1;
    	let t18;
    	let span4;
    	let t20;
    	let t21;
    	let a3;
    	let t23;
    	let li1;
    	let a4;
    	let img;
    	let img_src_value;
    	let t24;
    	let span5;
    	let t26;
    	let div12;
    	let a5;
    	let i4;
    	let t28;
    	let t29;
    	let a6;
    	let i5;
    	let t31;
    	let t32;
    	let a7;
    	let i6;
    	let t34;
    	let t35;
    	let div11;
    	let t36;
    	let a8;
    	let i7;
    	let t38;
    	let t39;
    	let nav0;
    	let a9;
    	let i8;

    	const block = {
    		c: function create() {
    			div13 = element("div");
    			nav1 = element("nav");
    			form = element("form");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			i0 = element("i");
    			t0 = space();
    			input = element("input");
    			t1 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			div3 = element("div");
    			i1 = element("i");
    			i1.textContent = "";
    			t3 = space();
    			span0 = element("span");
    			span0.textContent = "2";
    			t5 = space();
    			div10 = element("div");
    			a1 = element("a");
    			div5 = element("div");
    			div4 = element("div");
    			i2 = element("i");
    			i2.textContent = "";
    			t7 = space();
    			div6 = element("div");
    			span1 = element("span");
    			span1.textContent = "Analytics";
    			t9 = space();
    			p0 = element("p");
    			t10 = text("Your website’s active users count increased by ");
    			span2 = element("span");
    			span2.textContent = "28%";
    			t12 = text(" in the last week. Great job!");
    			t13 = space();
    			a2 = element("a");
    			div8 = element("div");
    			div7 = element("div");
    			i3 = element("i");
    			i3.textContent = "";
    			t15 = space();
    			div9 = element("div");
    			span3 = element("span");
    			span3.textContent = "Sales";
    			t17 = space();
    			p1 = element("p");
    			t18 = text("Last week your store’s sales count decreased by ");
    			span4 = element("span");
    			span4.textContent = "5.52%";
    			t20 = text(". It could have been worse!");
    			t21 = space();
    			a3 = element("a");
    			a3.textContent = "View all Notifications";
    			t23 = space();
    			li1 = element("li");
    			a4 = element("a");
    			img = element("img");
    			t24 = space();
    			span5 = element("span");
    			span5.textContent = "User";
    			t26 = space();
    			div12 = element("div");
    			a5 = element("a");
    			i4 = element("i");
    			i4.textContent = "";
    			t28 = text(" Profile");
    			t29 = space();
    			a6 = element("a");
    			i5 = element("i");
    			i5.textContent = "vertical_split";
    			t31 = text(" Blog Posts");
    			t32 = space();
    			a7 = element("a");
    			i6 = element("i");
    			i6.textContent = "note_add";
    			t34 = text(" Add New Post");
    			t35 = space();
    			div11 = element("div");
    			t36 = space();
    			a8 = element("a");
    			i7 = element("i");
    			i7.textContent = "";
    			t38 = text(" Logout");
    			t39 = space();
    			nav0 = element("nav");
    			a9 = element("a");
    			i8 = element("i");
    			i8.textContent = "";
    			attr_dev(i0, "class", "fas fa-search");
    			add_location(i0, file$3, 7, 12, 380);
    			attr_dev(div0, "class", "input-group-text");
    			add_location(div0, file$3, 6, 10, 337);
    			attr_dev(div1, "class", "input-group-prepend");
    			add_location(div1, file$3, 5, 8, 293);
    			attr_dev(input, "class", "navbar-search form-control");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Search for something...");
    			attr_dev(input, "aria-label", "Search");
    			add_location(input, file$3, 10, 8, 450);
    			attr_dev(div2, "class", "input-group input-group-seamless ml-3");
    			add_location(div2, file$3, 4, 6, 233);
    			attr_dev(form, "action", "#");
    			attr_dev(form, "class", "main-navbar__search w-100 d-none d-md-flex d-lg-flex");
    			add_location(form, file$3, 3, 4, 148);
    			attr_dev(i1, "class", "material-icons");
    			add_location(i1, file$3, 28, 10, 1045);
    			attr_dev(span0, "class", "badge badge-pill badge-danger");
    			add_location(span0, file$3, 29, 10, 1087);
    			attr_dev(div3, "class", "nav-link-icon__wrapper");
    			add_location(div3, file$3, 27, 8, 998);
    			attr_dev(a0, "class", "nav-link nav-link-icon text-center");
    			attr_dev(a0, "href", "/");
    			attr_dev(a0, "role", "button");
    			attr_dev(a0, "id", "dropdownMenuLink");
    			attr_dev(a0, "data-toggle", "dropdown");
    			attr_dev(a0, "aria-haspopup", "true");
    			attr_dev(a0, "aria-expanded", "false");
    			add_location(a0, file$3, 19, 8, 755);
    			attr_dev(i2, "class", "material-icons");
    			add_location(i2, file$3, 36, 14, 1408);
    			attr_dev(div4, "class", "notification__icon");
    			add_location(div4, file$3, 35, 12, 1361);
    			attr_dev(div5, "class", "notification__icon-wrapper");
    			add_location(div5, file$3, 34, 10, 1308);
    			attr_dev(span1, "class", "notification__category");
    			add_location(span1, file$3, 40, 12, 1534);
    			attr_dev(span2, "class", "text-success text-semibold");
    			add_location(span2, file$3, 41, 62, 1650);
    			add_location(p0, file$3, 41, 12, 1600);
    			attr_dev(div6, "class", "notification__content");
    			add_location(div6, file$3, 39, 10, 1486);
    			attr_dev(a1, "class", "dropdown-item");
    			attr_dev(a1, "href", "/");
    			add_location(a1, file$3, 33, 8, 1263);
    			attr_dev(i3, "class", "material-icons");
    			add_location(i3, file$3, 47, 14, 1918);
    			attr_dev(div7, "class", "notification__icon");
    			add_location(div7, file$3, 46, 12, 1871);
    			attr_dev(div8, "class", "notification__icon-wrapper");
    			add_location(div8, file$3, 45, 10, 1818);
    			attr_dev(span3, "class", "notification__category");
    			add_location(span3, file$3, 51, 12, 2044);
    			attr_dev(span4, "class", "text-danger text-semibold");
    			add_location(span4, file$3, 52, 63, 2157);
    			add_location(p1, file$3, 52, 12, 2106);
    			attr_dev(div9, "class", "notification__content");
    			add_location(div9, file$3, 50, 10, 1996);
    			attr_dev(a2, "class", "dropdown-item");
    			attr_dev(a2, "href", "/");
    			add_location(a2, file$3, 44, 8, 1773);
    			attr_dev(a3, "class", "dropdown-item notification__all text-center");
    			attr_dev(a3, "href", "/");
    			add_location(a3, file$3, 55, 8, 2279);
    			attr_dev(div10, "class", "dropdown-menu dropdown-menu-small");
    			attr_dev(div10, "aria-labelledby", "dropdownMenuLink");
    			add_location(div10, file$3, 32, 6, 1172);
    			attr_dev(li0, "class", "nav-item border-right dropdown notifications");
    			add_location(li0, file$3, 18, 6, 689);
    			attr_dev(img, "class", "user-avatar rounded-circle mr-2");
    			if (img.src !== (img_src_value = "images/default_user.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "User Avatar");
    			add_location(img, file$3, 66, 8, 2641);
    			attr_dev(span5, "class", "d-none d-md-inline-block");
    			add_location(span5, file$3, 69, 30, 2769);
    			attr_dev(a4, "class", "nav-link dropdown-toggle text-nowrap px-3");
    			attr_dev(a4, "data-toggle", "dropdown");
    			attr_dev(a4, "href", "/");
    			attr_dev(a4, "role", "button");
    			attr_dev(a4, "aria-haspopup", "true");
    			attr_dev(a4, "aria-expanded", "false");
    			add_location(a4, file$3, 59, 6, 2436);
    			attr_dev(i4, "class", "material-icons");
    			add_location(i4, file$3, 72, 63, 2948);
    			attr_dev(a5, "class", "dropdown-item");
    			attr_dev(a5, "href", "user-profile-lite.html");
    			add_location(a5, file$3, 72, 8, 2893);
    			attr_dev(i5, "class", "material-icons");
    			add_location(i5, file$3, 73, 67, 3059);
    			attr_dev(a6, "class", "dropdown-item");
    			attr_dev(a6, "href", "components-blog-posts.html");
    			add_location(a6, file$3, 73, 8, 3000);
    			attr_dev(i6, "class", "material-icons");
    			add_location(i6, file$3, 74, 58, 3177);
    			attr_dev(a7, "class", "dropdown-item");
    			attr_dev(a7, "href", "add-new-post.html");
    			add_location(a7, file$3, 74, 8, 3127);
    			attr_dev(div11, "class", "dropdown-divider");
    			add_location(div11, file$3, 75, 8, 3241);
    			attr_dev(i7, "class", "material-icons text-danger");
    			add_location(i7, file$3, 77, 10, 3343);
    			attr_dev(a8, "class", "dropdown-item text-danger");
    			attr_dev(a8, "href", "/");
    			add_location(a8, file$3, 76, 8, 3286);
    			attr_dev(div12, "class", "dropdown-menu dropdown-menu-small");
    			add_location(div12, file$3, 71, 6, 2837);
    			attr_dev(li1, "class", "nav-item dropdown");
    			add_location(li1, file$3, 58, 4, 2399);
    			attr_dev(ul, "class", "navbar-nav border-left flex-row ");
    			add_location(ul, file$3, 17, 4, 637);
    			attr_dev(i8, "class", "material-icons");
    			add_location(i8, file$3, 89, 6, 3711);
    			attr_dev(a9, "href", "/");
    			attr_dev(a9, "class", "nav-link nav-link-icon toggle-sidebar d-md-inline d-lg-none text-center border-left");
    			attr_dev(a9, "data-toggle", "collapse");
    			attr_dev(a9, "data-target", ".header-navbar");
    			attr_dev(a9, "aria-expanded", "false");
    			attr_dev(a9, "aria-controls", "header-navbar");
    			add_location(a9, file$3, 82, 4, 3454);
    			attr_dev(nav0, "class", "nav");
    			add_location(nav0, file$3, 81, 2, 3432);
    			attr_dev(nav1, "class", "navbar align-items-stretch navbar-light flex-md-nowrap p-0");
    			add_location(nav1, file$3, 2, 2, 71);
    			attr_dev(div13, "class", "main-navbar sticky-top bg-white");
    			add_location(div13, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div13, anchor);
    			append_dev(div13, nav1);
    			append_dev(nav1, form);
    			append_dev(form, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, i0);
    			append_dev(div2, t0);
    			append_dev(div2, input);
    			append_dev(nav1, t1);
    			append_dev(nav1, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(a0, div3);
    			append_dev(div3, i1);
    			append_dev(div3, t3);
    			append_dev(div3, span0);
    			append_dev(li0, t5);
    			append_dev(li0, div10);
    			append_dev(div10, a1);
    			append_dev(a1, div5);
    			append_dev(div5, div4);
    			append_dev(div4, i2);
    			append_dev(a1, t7);
    			append_dev(a1, div6);
    			append_dev(div6, span1);
    			append_dev(div6, t9);
    			append_dev(div6, p0);
    			append_dev(p0, t10);
    			append_dev(p0, span2);
    			append_dev(p0, t12);
    			append_dev(div10, t13);
    			append_dev(div10, a2);
    			append_dev(a2, div8);
    			append_dev(div8, div7);
    			append_dev(div7, i3);
    			append_dev(a2, t15);
    			append_dev(a2, div9);
    			append_dev(div9, span3);
    			append_dev(div9, t17);
    			append_dev(div9, p1);
    			append_dev(p1, t18);
    			append_dev(p1, span4);
    			append_dev(p1, t20);
    			append_dev(div10, t21);
    			append_dev(div10, a3);
    			append_dev(ul, t23);
    			append_dev(ul, li1);
    			append_dev(li1, a4);
    			append_dev(a4, img);
    			append_dev(a4, t24);
    			append_dev(a4, span5);
    			append_dev(li1, t26);
    			append_dev(li1, div12);
    			append_dev(div12, a5);
    			append_dev(a5, i4);
    			append_dev(a5, t28);
    			append_dev(div12, t29);
    			append_dev(div12, a6);
    			append_dev(a6, i5);
    			append_dev(a6, t31);
    			append_dev(div12, t32);
    			append_dev(div12, a7);
    			append_dev(a7, i6);
    			append_dev(a7, t34);
    			append_dev(div12, t35);
    			append_dev(div12, div11);
    			append_dev(div12, t36);
    			append_dev(div12, a8);
    			append_dev(a8, i7);
    			append_dev(a8, t38);
    			append_dev(nav1, t39);
    			append_dev(nav1, nav0);
    			append_dev(nav0, a9);
    			append_dev(a9, i8);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div13);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TopBar> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("TopBar", $$slots, []);
    	return [];
    }

    class TopBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TopBar",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/layouts/main/layout-components/logo/Logo.svelte generated by Svelte v3.20.1 */

    const file$4 = "src/layouts/main/layout-components/logo/Logo.svelte";

    function create_fragment$5(ctx) {
    	let div1;
    	let nav;
    	let a0;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let span;
    	let t2;
    	let a1;
    	let i;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			nav = element("nav");
    			a0 = element("a");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			span = element("span");
    			span.textContent = "Shards Dashboard";
    			t2 = space();
    			a1 = element("a");
    			i = element("i");
    			attr_dev(img, "id", "main-logo");
    			attr_dev(img, "class", "d-inline-block align-top mr-1");
    			set_style(img, "max-width", "25px");
    			if (img.src !== (img_src_value = "images/shards-dashboards-logo.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Shards Dashboard");
    			add_location(img, file$4, 7, 8, 263);
    			attr_dev(span, "class", "d-none d-md-inline ml-1");
    			add_location(span, file$4, 13, 8, 474);
    			attr_dev(div0, "class", "d-table m-auto");
    			add_location(div0, file$4, 6, 6, 226);
    			attr_dev(a0, "class", "navbar-brand w-100 mr-0");
    			attr_dev(a0, "href", "/");
    			set_style(a0, "line-height", "25px");
    			add_location(a0, file$4, 2, 4, 128);
    			attr_dev(i, "class", "material-icons");
    			add_location(i, file$4, 19, 6, 649);
    			attr_dev(a1, "class", "toggle-sidebar d-sm-inline d-md-none d-lg-none");
    			attr_dev(a1, "href", "/");
    			add_location(a1, file$4, 16, 4, 562);
    			attr_dev(nav, "class", "navbar align-items-stretch navbar-light bg-white flex-md-nowrap border-bottom p-0");
    			add_location(nav, file$4, 1, 2, 28);
    			attr_dev(div1, "class", "main-navbar");
    			add_location(div1, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, nav);
    			append_dev(nav, a0);
    			append_dev(a0, div0);
    			append_dev(div0, img);
    			append_dev(div0, t0);
    			append_dev(div0, span);
    			append_dev(nav, t2);
    			append_dev(nav, a1);
    			append_dev(a1, i);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Logo> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Logo", $$slots, []);
    	return [];
    }

    class Logo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Logo",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    // List of nodes to update
    const nodes = [];

    // Current location
    let location$1;

    // Function that updates all nodes marking the active ones
    function checkActive(el) {
        // Remove the active class from all elements
        el.node.classList.remove(el.className);

        // If the pattern matches, then set the active class
        if (el.pattern.test(location$1)) {
            el.node.classList.add(el.className);
        }
    }

    // Listen to changes in the location
    loc.subscribe((value) => {
        // Update the location
        location$1 = value.location + (value.querystring ? '?' + value.querystring : '');

        // Update all nodes
        nodes.map(checkActive);
    });

    /**
     * @typedef {Object} ActiveOptions
     * @property {string|RegExp} [path] - Path expression that makes the link active when matched (must start with '/' or '*'); default is the link's href
     * @property {string} [className] - CSS class to apply to the element when active; default value is "active"
     */

    /**
     * Svelte Action for automatically adding the "active" class to elements (links, or any other DOM element) when the current location matches a certain path.
     * 
     * @param {HTMLElement} node - The target node (automatically set by Svelte)
     * @param {ActiveOptions|string|RegExp} [opts] - Can be an object of type ActiveOptions, or a string (or regular expressions) representing ActiveOptions.path.
     */
    function active(node, opts) {
        // Check options
        if (opts && (typeof opts == 'string' || (typeof opts == 'object' && opts instanceof RegExp))) {
            // Interpret strings and regular expressions as opts.path
            opts = {
                path: opts
            };
        }
        else {
            // Ensure opts is a dictionary
            opts = opts || {};
        }

        // Path defaults to link target
        if (!opts.path && node.hasAttribute('href')) {
            opts.path = node.getAttribute('href');
            if (opts.path && opts.path.length > 1 && opts.path.charAt(0) == '#') {
                opts.path = opts.path.substring(1);
            }
        }

        // Default class name
        if (!opts.className) {
            opts.className = 'active';
        }

        // If path is a string, it must start with '/' or '*'
        if (!opts.path || 
            typeof opts.path == 'string' && (opts.path.length < 1 || (opts.path.charAt(0) != '/' && opts.path.charAt(0) != '*'))
        ) {
            throw Error('Invalid value for "path" argument')
        }

        // If path is not a regular expression already, make it
        const {pattern} = typeof opts.path == 'string' ?
            regexparam(opts.path) :
            {pattern: opts.path};

        // Add the node to the list
        const el = {
            node,
            className: opts.className,
            pattern
        };
        nodes.push(el);

        // Trigger the action right away
        checkActive(el);

        return {
            // When the element is destroyed, remove it from the list
            destroy() {
                nodes.splice(nodes.indexOf(el), 1);
            }
        }
    }

    /* src/layouts/main/layout-components/side-nav-item/SideNavItem.svelte generated by Svelte v3.20.1 */
    const file$5 = "src/layouts/main/layout-components/side-nav-item/SideNavItem.svelte";

    function create_fragment$6(ctx) {
    	let li;
    	let a;
    	let i;
    	let t0;
    	let t1;
    	let span;
    	let t2;
    	let link_action;
    	let active_action;
    	let dispose;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			i = element("i");
    			t0 = text(/*icon*/ ctx[1]);
    			t1 = space();
    			span = element("span");
    			t2 = text(/*text*/ ctx[2]);
    			attr_dev(i, "class", "material-icons");
    			add_location(i, file$5, 14, 4, 289);
    			add_location(span, file$5, 15, 4, 330);
    			attr_dev(a, "class", "nav-link active");
    			attr_dev(a, "href", /*href*/ ctx[0]);
    			add_location(a, file$5, 9, 2, 205);
    			attr_dev(li, "class", "nav-item");
    			add_location(li, file$5, 8, 0, 181);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, i);
    			append_dev(i, t0);
    			append_dev(a, t1);
    			append_dev(a, span);
    			append_dev(span, t2);
    			if (remount) run_all(dispose);

    			dispose = [
    				action_destroyer(link_action = link.call(null, a)),
    				action_destroyer(active_action = active.call(null, a))
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*icon*/ 2) set_data_dev(t0, /*icon*/ ctx[1]);
    			if (dirty & /*text*/ 4) set_data_dev(t2, /*text*/ ctx[2]);

    			if (dirty & /*href*/ 1) {
    				attr_dev(a, "href", /*href*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { href = "/" } = $$props;
    	let { icon = "" } = $$props;
    	let { text = "" } = $$props;
    	const writable_props = ["href", "icon", "text"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SideNavItem> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("SideNavItem", $$slots, []);

    	$$self.$set = $$props => {
    		if ("href" in $$props) $$invalidate(0, href = $$props.href);
    		if ("icon" in $$props) $$invalidate(1, icon = $$props.icon);
    		if ("text" in $$props) $$invalidate(2, text = $$props.text);
    	};

    	$$self.$capture_state = () => ({ link, active, href, icon, text });

    	$$self.$inject_state = $$props => {
    		if ("href" in $$props) $$invalidate(0, href = $$props.href);
    		if ("icon" in $$props) $$invalidate(1, icon = $$props.icon);
    		if ("text" in $$props) $$invalidate(2, text = $$props.text);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [href, icon, text];
    }

    class SideNavItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { href: 0, icon: 1, text: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SideNavItem",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get href() {
    		throw new Error("<SideNavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<SideNavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<SideNavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<SideNavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<SideNavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<SideNavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/layouts/main/layout-components/side-nav/SideNav.svelte generated by Svelte v3.20.1 */
    const file$6 = "src/layouts/main/layout-components/side-nav/SideNav.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i].id;
    	child_ctx[2] = object_without_properties(list[i], ["id"]);
    	return child_ctx;
    }

    // (40:6) {#each modules as {id, ...props}
    function create_each_block(key_1, ctx) {
    	let first;
    	let current;
    	const sidenavitem_spread_levels = [/*props*/ ctx[2]];
    	let sidenavitem_props = {};

    	for (let i = 0; i < sidenavitem_spread_levels.length; i += 1) {
    		sidenavitem_props = assign(sidenavitem_props, sidenavitem_spread_levels[i]);
    	}

    	const sidenavitem = new SideNavItem({ props: sidenavitem_props, $$inline: true });

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(sidenavitem.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(sidenavitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const sidenavitem_changes = (dirty & /*modules*/ 1)
    			? get_spread_update(sidenavitem_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			sidenavitem.$set(sidenavitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidenavitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidenavitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(sidenavitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(40:6) {#each modules as {id, ...props}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let aside;
    	let t0;
    	let form;
    	let div2;
    	let div1;
    	let div0;
    	let i;
    	let t1;
    	let input;
    	let t2;
    	let div3;
    	let ul;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	const logo = new Logo({ $$inline: true });
    	let each_value = /*modules*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*id*/ ctx[1];
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			aside = element("aside");
    			create_component(logo.$$.fragment);
    			t0 = space();
    			form = element("form");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			i = element("i");
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			div3 = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(i, "class", "fas fa-search");
    			add_location(i, file$6, 25, 10, 1004);
    			attr_dev(div0, "class", "input-group-text");
    			add_location(div0, file$6, 24, 8, 963);
    			attr_dev(div1, "class", "input-group-prepend");
    			add_location(div1, file$6, 23, 6, 921);
    			attr_dev(input, "class", "navbar-search form-control");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Search for something...");
    			attr_dev(input, "aria-label", "Search");
    			add_location(input, file$6, 28, 6, 1068);
    			attr_dev(div2, "class", "input-group input-group-seamless ml-3");
    			add_location(div2, file$6, 22, 4, 863);
    			attr_dev(form, "action", "#");
    			attr_dev(form, "class", "main-sidebar__search w-100 border-right d-sm-flex d-md-none d-lg-none");
    			add_location(form, file$6, 19, 2, 753);
    			attr_dev(ul, "class", "nav flex-column");
    			add_location(ul, file$6, 38, 4, 1301);
    			attr_dev(div3, "class", "nav-wrapper");
    			add_location(div3, file$6, 37, 2, 1271);
    			attr_dev(aside, "class", "main-sidebar col-12 col-md-3 col-lg-2 px-0");
    			add_location(aside, file$6, 15, 0, 651);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, aside, anchor);
    			mount_component(logo, aside, null);
    			append_dev(aside, t0);
    			append_dev(aside, form);
    			append_dev(form, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, i);
    			append_dev(div2, t1);
    			append_dev(div2, input);
    			append_dev(aside, t2);
    			append_dev(aside, div3);
    			append_dev(div3, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*modules*/ 1) {
    				const each_value = /*modules*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, ul, outro_and_destroy_block, create_each_block, null, get_each_context);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(logo.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(logo.$$.fragment, local);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(aside);
    			destroy_component(logo);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	const modules = [
    		{
    			id: 1,
    			href: "/",
    			icon: "edit",
    			text: "Dashboard"
    		},
    		{
    			id: 2,
    			href: "/posts",
    			icon: "vertical_split",
    			text: "Posts"
    		},
    		{
    			id: 3,
    			href: "/add-post",
    			icon: "note_add",
    			text: "Add New Post"
    		},
    		{
    			id: 4,
    			href: "/forms-components",
    			icon: "view_module",
    			text: "Forms & Components"
    		},
    		{
    			id: 5,
    			href: "/tables",
    			icon: "table_chart",
    			text: "Tables"
    		},
    		{
    			id: 6,
    			href: "/user-profile",
    			icon: "person",
    			text: "User Profile"
    		},
    		{
    			id: 7,
    			href: "/errors",
    			icon: "error",
    			text: "Errors"
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SideNav> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("SideNav", $$slots, []);
    	$$self.$capture_state = () => ({ Logo, SideNavItem, modules });
    	return [modules];
    }

    class SideNav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SideNav",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/layouts/main/layout-components/footer/Footer.svelte generated by Svelte v3.20.1 */

    const file$7 = "src/layouts/main/layout-components/footer/Footer.svelte";

    function create_fragment$8(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "footer";
    			attr_dev(div, "class", "item footer svelte-17wds2y");
    			add_location(div, file$7, 11, 0, 146);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Footer", $$slots, []);
    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/layouts/main/MainLayout.svelte generated by Svelte v3.20.1 */
    const file$8 = "src/layouts/main/MainLayout.svelte";

    // (26:10)        
    function fallback_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "content";
    			attr_dev(div, "class", "content");
    			add_location(div, file$8, 26, 6, 637);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(26:10)        ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div;
    	let t0;
    	let main;
    	let t1;
    	let t2;
    	let current;
    	const sidenav = new SideNav({ $$inline: true });
    	const topbar = new TopBar({ $$inline: true });
    	const default_slot_template = /*$$slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);
    	const footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(sidenav.$$.fragment);
    			t0 = space();
    			main = element("main");
    			create_component(topbar.$$.fragment);
    			t1 = space();
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			t2 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(main, "class", "main-content col-lg-10 col-md-9 col-sm-12 p-0 offset-lg-2 offset-md-3");
    			add_location(main, file$8, 23, 2, 521);
    			attr_dev(div, "class", "main-layout row svelte-2vcaxc");
    			add_location(div, file$8, 20, 0, 475);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(sidenav, div, null);
    			append_dev(div, t0);
    			append_dev(div, main);
    			mount_component(topbar, main, null);
    			append_dev(main, t1);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(main, null);
    			}

    			append_dev(main, t2);
    			mount_component(footer, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[0], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null));
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidenav.$$.fragment, local);
    			transition_in(topbar.$$.fragment, local);
    			transition_in(default_slot_or_fallback, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidenav.$$.fragment, local);
    			transition_out(topbar.$$.fragment, local);
    			transition_out(default_slot_or_fallback, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(sidenav);
    			destroy_component(topbar);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			destroy_component(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<MainLayout> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("MainLayout", $$slots, ['default']);

    	$$self.$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ TopBar, SideNav, Footer });
    	return [$$scope, $$slots];
    }

    class MainLayout extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MainLayout",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.20.1 */

    const { console: console_1$1 } = globals;

    // (28:0) <MainLayout>
    function create_default_slot(ctx) {
    	let current;
    	const router = new Router({ props: { routes }, $$inline: true });
    	router.$on("conditionsFailed", /*conditionsFailed*/ ctx[0]);
    	router.$on("routeLoaded", /*routeLoaded*/ ctx[1]);
    	router.$on("routeEvent", /*routeEvent*/ ctx[2]);

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(28:0) <MainLayout>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let current;

    	const mainlayout = new MainLayout({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(mainlayout.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(mainlayout, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const mainlayout_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				mainlayout_changes.$$scope = { dirty, ctx };
    			}

    			mainlayout.$set(mainlayout_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mainlayout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mainlayout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(mainlayout, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	const conditionsFailed = event => {
    		// eslint-disable-next-line no-console
    		console.error("Caught event conditionsFailed", event.detail);
    	};

    	// Handles the "routeLoaded" event dispatched by the router after a route has been successfully loaded
    	// import ImageExample from './components/image-example/ImageExample.svelte'
    	const routeLoaded = event => {
    		// eslint-disable-next-line no-console
    		console.info("Caught event routeLoaded", event.detail);
    	};

    	// Handles event bubbling up from nested routes
    	const routeEvent = event => {
    		// eslint-disable-next-line no-console
    		console.info("Caught event routeEvent", event.detail);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);

    	$$self.$capture_state = () => ({
    		Router,
    		routes,
    		MainLayout,
    		conditionsFailed,
    		routeLoaded,
    		routeEvent
    	});

    	return [conditionsFailed, routeLoaded, routeEvent];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    const app = new App({
      target: document.body
    });

    window.app = app;

    return app;

}());
//# sourceMappingURL=bundle.js.map
