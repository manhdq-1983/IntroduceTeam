# -*- coding: utf-8 -*-

from odoo import http
from odoo.http import request
from odoo.addons.website.controllers.main import Website


class Homepage(Website):
    @http.route('/', type='http', auth="public", website=True)
    def homepage(self, order=None, new=None, s_action=None, db=None, **kw):

        product = request.env['product.template'].search([('x_type', '=', 'complete_product')])
        customer = request.env['product.template'].search([('x_type', '=', 'customer')])
        user = request.env['res.users'].search([('company_ids', '=', 'team')])
        experience = request.env['introduce.experience'].sudo().search([])
        teams = request.env['res.company'].sudo().search([('x_id', '=', '1')])
        odoos = request.env['res.company'].sudo().search([('x_id', '=', '2')])
        menu_parent = request.env['product.public.category'].search([('parent_id', '=', False)])

        if len(teams) > 0:
            team = teams[0]

        if len(odoos) > 0:
            odoo = odoos[0]

        menu_customs = []
        for item in menu_parent:
            menu_item = {
                "parent": item,
                "childs": request.env['product.public.category'].search([('parent_id', '=', item.id)])
            }
            menu_customs.append(menu_item)

        return http.request.render('introduce_company.homepage', {
            'menu': menu_customs,
            'odoo': odoo,
            'team': team,
            'experience': experience,
            'user': user,
            'product': product,
            'customer': customer,
        })