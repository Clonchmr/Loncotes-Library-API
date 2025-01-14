using System.ComponentModel.DataAnnotations;

namespace LoncotesLibrary.Models.DTOs;

public class PatronDTO
{
    public int Id { get; set; }
    [Required]
    public string FirstName { get; set; }
    [Required]
    public string LastName { get; set; }
    [Required]
    public string Address { get; set ;}
    [Required]
    public string Email { get; set; }
    public bool IsActive { get; set; }
    public List<CheckoutDTO> Checkout { get; set; }
}

public class PatronWithBalanceDTO
{
    public int Id { get; set; }
    [Required]
    public string FirstName { get; set; }
    [Required]
    public string LastName { get; set; }
    [Required]
    public string Address { get; set ;}
    [Required]
    public string Email { get; set; }
    public bool IsActive { get; set; }
    public List<CheckoutWithLateFeeDTO> Checkout { get; set; }
    public decimal? Balance 
    {
        get
        {
            decimal balance = 0M;
            List<CheckoutWithLateFeeDTO> unpaidCheckouts = Checkout.Where(c => c.Paid == false).ToList();
            foreach (CheckoutWithLateFeeDTO checkout in unpaidCheckouts)
            {
                balance += checkout.LateFee ?? 0;
            }
            return balance;
        }
    }
}