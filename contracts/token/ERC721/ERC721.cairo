%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin, SignatureBuiltin
from starkware.starknet.common.syscalls import get_contract_address, get_caller_address
from contracts.token.ERC721.ERC721_base import (
    ERC721_name, ERC721_symbol, ERC721_balanceOf, ERC721_ownerOf, ERC721_getApproved,
    ERC721_isApprovedForAll, ERC721_mint, ERC721_burn, ERC721_initializer, ERC721_approve,
    ERC721_setApprovalForAll, ERC721_transferFrom, ERC721_safeTransferFrom)
from contracts.token.ERC20.IERC20 import IERC20
from starkware.cairo.common.math import (assert_not_zero, assert_in_range, assert_le, unsigned_div_rem)
from starkware.cairo.common.uint256 import (
    Uint256,
    uint256_add,
    uint256_sub,
    uint256_le,
    uint256_lt,
    uint256_check,
    uint256_eq,
)
# Struct to track animals characteristics

struct animals_core :
    member legs : felt
    member sex  : felt
    member wings : felt
end

@storage_var
func is_registered_breeder(address : felt) -> (isRegistered : felt):
end

@storage_var
func registration_price_storage() -> (price : Uint256):
end

@storage_var
func dummy_token_address_storage() -> (dummy_token : felt):
end

@storage_var
func animals_core_storage(token_id : Uint256) -> (animal : animals_core):
end

@storage_var
func id_counter_storage() -> (id_counter : Uint256):
end

@storage_var
func account_index_count(account : felt) -> (index : felt):
end

@storage_var
func token_of_owner_by_index_storage(account : felt , index : felt) -> (token_id : Uint256):
end

@storage_var
func indexes_by_token_id(TokenId : Uint256) -> (index : felt):
end

@constructor
func constructor{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        _dummy_token_address : felt ,name : felt, symbol : felt, to_ : felt):
    ERC721_initializer(name, symbol)
    let amount: Uint256 = Uint256(1*1000000000000000000, 0)
    registration_price_storage.write(amount)
    dummy_token_address_storage.write(_dummy_token_address)
    let to = to_
    let (new_id) = internal_mint(sex_ = 0, legs_ = 0, wings_ = 0, to_ = to)
    return ()
end

#
# Getters
#

@view
func name{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}() -> (name : felt):
    let (name) = ERC721_name()
    return (name)
end

@view
func symbol{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}() -> (symbol : felt):
    let (symbol) = ERC721_symbol()
    return (symbol)
end

@view
func balanceOf{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(owner : felt) -> (
        balance : Uint256):
    let (balance : Uint256) = ERC721_balanceOf(owner)
    return (balance)
end

@view
func ownerOf{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        token_id : Uint256) -> (owner : felt):
    let (owner : felt) = ERC721_ownerOf(token_id)
    return (owner)
end

@view
func getApproved{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        token_id : Uint256) -> (approved : felt):
    let (approved : felt) = ERC721_getApproved(token_id)
    return (approved)
end

@view
func isApprovedForAll{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        owner : felt, operator : felt) -> (is_approved : felt):
    let (is_approved : felt) = ERC721_isApprovedForAll(owner, operator)
    return (is_approved)
end

@view
func getTokenCount{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}() -> (token_count : Uint256):
    let (id_counter) = id_counter_storage.read()
    return (id_counter)
end

@view
func token_of_owner_by_index{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(account : felt, index : felt) -> (token_id : Uint256):
    let (token_id) = token_of_owner_by_index_storage.read(account,index)
    return (token_id)
end

@view 
func get_animal_characteristics{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
    token_id : Uint256
) -> (sex : felt, legs : felt, wings : felt) :
    let (animal_core_instance) = animals_core_storage.read(token_id)
    return (sex=animal_core_instance.sex,legs=animal_core_instance.legs,wings=animal_core_instance.wings)
end

@view
func is_breeder{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
    account : felt
) -> (is_approved : felt):
    let (is_approved) = is_registered_breeder.read(account)
    return (is_approved)
end

@view
func registration_price{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}() -> (price : Uint256):
    let (price) = registration_price_storage.read()
    return (price)
end

#
# Externals
#
@external
func mint{pedersen_ptr : HashBuiltin*, syscall_ptr : felt*, range_check_ptr}(
    sex_ : felt, legs_ : felt, wings_ : felt,  to_ : felt) -> (token_id : Uint256):
    let to = to_
    let (new_id) = internal_mint(sex_ = sex_, legs_ =legs_, wings_ = wings_,  to_ = to)
    return (new_id)
end

@external
func declare_animal{pedersen_ptr : HashBuiltin*, syscall_ptr : felt*, range_check_ptr}(
    sex : felt, legs : felt, wings : felt) -> (token_id : Uint256):
    alloc_locals
    let (sender_address) = get_caller_address()
    let (new_id) = internal_mint(sex_ = sex, legs_ =legs, wings_ = wings,  to_ = sender_address)
    tempvar syscall_ptr = syscall_ptr
    tempvar pedersen_ptr = pedersen_ptr
    tempvar range_check_ptr = range_check_ptr
    return (new_id)
end

@external
func declare_dead_animal{pedersen_ptr : HashBuiltin*, syscall_ptr : felt*, range_check_ptr}(
    token_id : Uint256 ):
    let animals_core_instance = animals_core(0,0,0)
    animals_core_storage.write(token_id,animals_core_instance)
    ERC721_burn(token_id)
    return()
end

@external 
func register_me_as_breeder{pedersen_ptr : HashBuiltin*, syscall_ptr : felt*, range_check_ptr}() -> (is_added : felt) :
    
    alloc_locals
    let (sender_address) = get_caller_address()
    let (contract_address) = get_contract_address()
    let (registration_price_256) = registration_price_storage.read()
    let (token_address) = dummy_token_address_storage.read()
    let (user_balance_256) = IERC20.balanceOf(contract_address = token_address, account= sender_address)
    let registration_price = registration_price_256.low
    let user_balance = user_balance_256.low
    let (is_le) = uint256_le(registration_price_256 , user_balance_256 )
    # assert_le(registration_price, user_balance)

    assert is_le = 1

    tempvar syscall_ptr = syscall_ptr
    tempvar pedersen_ptr = pedersen_ptr
    tempvar range_check_ptr = range_check_ptr

    IERC20.transferFrom(contract_address = token_address, sender = sender_address, recipient = contract_address, amount = registration_price_256)

    is_registered_breeder.write(sender_address,1)
    
    return (1)
end

@external
func approve{pedersen_ptr : HashBuiltin*, syscall_ptr : felt*, range_check_ptr}(
        to : felt, token_id : Uint256):
    ERC721_approve(to, token_id)
    return ()
end

@external
func setApprovalForAll{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        operator : felt, approved : felt):
    ERC721_setApprovalForAll(operator, approved)
    return ()
end

@external
func transferFrom{pedersen_ptr : HashBuiltin*, syscall_ptr : felt*, range_check_ptr}(
        _from : felt, to : felt, token_id : Uint256):
    ERC721_transferFrom(_from, to, token_id)
    remove_token_from_enumeration(_from,token_id)
    add_token_to_enumeration(to,token_id)
    return ()
end

@external
func safeTransferFrom{pedersen_ptr : HashBuiltin*, syscall_ptr : felt*, range_check_ptr}(
        _from : felt, to : felt, token_id : Uint256, data_len : felt, data : felt*):
    ERC721_safeTransferFrom(_from, to, token_id, data_len, data)
    remove_token_from_enumeration(_from,token_id)
    add_token_to_enumeration(to,token_id)
    return ()
end

func internal_mint{pedersen_ptr : HashBuiltin*, syscall_ptr : felt*, range_check_ptr}(
       sex_ : felt, legs_ : felt, wings_ : felt,  to_ : felt) -> (token_id : Uint256):
    alloc_locals
    let to = to_
    let (id_counter : Uint256) = id_counter_storage.read()
    let one_as_uint256 : Uint256 = Uint256(1, 0)
    let (new_id, _) = uint256_add(id_counter,one_as_uint256)
    id_counter_storage.write(new_id)

    let animals_core_instance = animals_core(
        legs=legs_,
        sex=sex_,
        wings=wings_
    )
    animals_core_storage.write(new_id,animals_core_instance)
    add_token_to_enumeration(to,new_id)
    tempvar syscall_ptr = syscall_ptr
    tempvar pedersen_ptr = pedersen_ptr
    tempvar range_check_ptr = range_check_ptr
    ERC721_mint(to, new_id)

    return (new_id)
end

func remove_token_from_enumeration{pedersen_ptr : HashBuiltin*, syscall_ptr : felt*, range_check_ptr}(
    _from : felt , _TokenId : Uint256
):
    let (balance_256) = balanceOf(_from)
    let last_index = balance_256.low - 1 
    let (token_index) = indexes_by_token_id.read(_TokenId)
    let (curr_account_index_count) = account_index_count.read(_from)

    let (lastToken) = token_of_owner_by_index_storage.read(_from,last_index)
    token_of_owner_by_index_storage.write(_from,token_index,lastToken)

    account_index_count.write(_from,curr_account_index_count-1)

    return ()
end

func add_token_to_enumeration{pedersen_ptr : HashBuiltin*, syscall_ptr : felt*, range_check_ptr}(
    _to : felt , _TokenId : Uint256
):
    let (index_count) = account_index_count.read(_to)
    token_of_owner_by_index_storage.write(_to,index_count,_TokenId)
    indexes_by_token_id.write(_TokenId,index_count)
    let new_index_count = index_count + 1
    account_index_count.write(_to,new_index_count)

    return ()
end